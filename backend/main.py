"""
百邑酒世界 - FastAPI Backend
Mock Data Demo Version
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import asyncio
import random
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="百邑酒世界 API",
    description="个性化酒类 O2O 平台 Demo",
    version="0.1.0"
)

# CORS - allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────
# Load Mock Data
# ──────────────────────────────────
MOCK_DIR = Path(__file__).parent / "mock_data"

def load_json(filename: str) -> dict:
    with open(MOCK_DIR / filename, encoding="utf-8") as f:
        return json.load(f)

categories_data = load_json("categories.json")
products_data   = load_json("products.json")
stores_data     = load_json("stores.json")
cards_data      = load_json("cards.json")

# In-memory inventory counters (mock)
inventory_counts = {
    p["id"]: {"total_in": random.randint(100, 500), "total_out": random.randint(10, 80)}
    for p in products_data["products"]
}

# ──────────────────────────────────
# Routes: Categories
# ──────────────────────────────────
@app.get("/api/categories")
async def get_categories():
    return categories_data["categories"]


# ──────────────────────────────────
# Routes: Products
# ──────────────────────────────────
@app.get("/api/products")
async def get_products(
    category: str | None = Query(None),
    year_min: int | None = Query(None),
    year_max: int | None = Query(None),
    degree_min: float | None = Query(None),
    degree_max: float | None = Query(None),
    price_min: float | None = Query(None),
    price_max: float | None = Query(None),
    brand: str | None = Query(None),
    is_hot: bool | None = Query(None),
    is_new: bool | None = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0)
):
    products = products_data["products"]

    if category:
        products = [p for p in products if p["category"] == category]
    if year_min is not None:
        products = [p for p in products if p["year"] >= year_min]
    if year_max is not None:
        products = [p for p in products if p["year"] <= year_max]
    if degree_min is not None:
        products = [p for p in products if p["degree"] >= degree_min]
    if degree_max is not None:
        products = [p for p in products if p["degree"] <= degree_max]
    if price_min is not None:
        products = [p for p in products if p["price"] >= price_min]
    if price_max is not None:
        products = [p for p in products if p["price"] <= price_max]
    if brand:
        products = [p for p in products if brand.lower() in p["brand"].lower()]
    if is_hot is not None:
        products = [p for p in products if p["is_hot"] == is_hot]
    if is_new is not None:
        products = [p for p in products if p["is_new"] == is_new]

    total = len(products)
    return {"total": total, "items": products[offset: offset + limit]}


@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    for p in products_data["products"]:
        if p["id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="商品不存在")


@app.get("/api/ads")
async def get_ads():
    return products_data["ads"]


# ──────────────────────────────────
# Routes: Stores
# ──────────────────────────────────
@app.get("/api/stores")
async def get_stores(
    lat: float | None = Query(None),
    lng: float | None = Query(None),
    radius_km: float = Query(10.0)
):
    stores = stores_data["stores"]
    # Simple distance mock (in real app use Haversine formula)
    if lat and lng:
        stores = sorted(stores, key=lambda s: s["distance_km"])
    return stores


@app.get("/api/stores/{store_id}")
async def get_store(store_id: str):
    for s in stores_data["stores"]:
        if s["id"] == store_id:
            return s
    raise HTTPException(status_code=404, detail="门店不存在")


# ──────────────────────────────────
# Routes: Blockchain Card
# ──────────────────────────────────
@app.get("/api/card/{card_id}/balance")
async def get_card_balance(card_id: str):
    for card in cards_data["cards"]:
        if card["card_id"] == card_id:
            return {
                "card_id": card["display_id"],
                "balance": card["balance"],
                "face_value": card["face_value"],
                "status": card["status"],
                "status_label": {"active": "有效", "redeemed": "已兑完", "burned": "已销毁"}.get(card["status"], "未知"),
                "expires_at": card["expires_at"],
                "tx_hash": card["tx_hash"],
                "redeem_store": card["redeem_store"],
                "transactions": card["transactions"]
            }
    raise HTTPException(status_code=404, detail="卡不存在或卡号有误")


# ──────────────────────────────────
# Routes: Inventory / Scan
# ──────────────────────────────────
scan_log = []  # In-memory log for demo

@app.post("/api/inventory/scan")
async def scan_inventory(data: dict):
    """
    Expects: { "qr_code": str, "action": "in"|"out", "product_id": str, "operator": str }
    """
    qr_code   = data.get("qr_code", "")
    action    = data.get("action", "in")
    product_id = data.get("product_id", "")
    operator  = data.get("operator", "店员")

    # Idempotency check: block duplicate out-scans for same QR
    if action == "out":
        for log in scan_log:
            if log["qr_code"] == qr_code and log["action"] == "out":
                return JSONResponse(
                    status_code=409,
                    content={"error": "该二维码已出库，重复扫码被拦截", "qr_code": qr_code}
                )

    if product_id in inventory_counts:
        if action == "in":
            inventory_counts[product_id]["total_in"] += 1
        else:
            if inventory_counts[product_id]["total_in"] - inventory_counts[product_id]["total_out"] <= 0:
                return JSONResponse(status_code=400, content={"error": "库存不足，无法出库"})
            inventory_counts[product_id]["total_out"] += 1

    event = {
        "id": f"EVT-{len(scan_log)+1:06d}",
        "qr_code": qr_code,
        "action": action,
        "action_label": "入库" if action == "in" else "出库",
        "product_id": product_id,
        "operator": operator,
        "timestamp": datetime.now().isoformat()
    }
    scan_log.append(event)

    return {"success": True, "event": event}


@app.get("/api/inventory/stats")
async def get_inventory_stats():
    return {
        "total_in_today": sum(random.randint(5, 50) for _ in range(len(inventory_counts))),
        "total_out_today": sum(random.randint(1, 20) for _ in range(len(inventory_counts))),
        "scan_log": scan_log[-20:],  # Last 20 events
        "per_product": [
            {
                "product_id": pid,
                "total_in": v["total_in"],
                "total_out": v["total_out"],
                "stock": v["total_in"] - v["total_out"]
            }
            for pid, v in inventory_counts.items()
        ]
    }


# ──────────────────────────────────
# WebSocket: AI Livestream
# ──────────────────────────────────
BARRAGE_USERS = ["酒仙王大爷", "茅台爱好者", "威士忌小姐", "白酒达人", "品酒师Lily", "葡萄酒玩家"]
BARRAGE_MSGS = [
    "这款茅台性价比超高！", "已下单3瓶！", "主播讲得太专业了", "老师推荐的必买！",
    "干邑怎么选？", "麦卡伦18年值吗？", "666！", "第一次买酒，求推荐",
    "送礼首选！", "年份越老越好吗？", "度数低的好喝吗？", "已经是会员了"
]

@app.websocket("/ws/livestream")
async def livestream_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        products = products_data["products"]
        tick = 0
        while True:
            await asyncio.sleep(1.5)
            tick += 1

            if tick % 7 == 0:
                # Push a product spotlight every 7 ticks
                product = random.choice(products)
                await websocket.send_json({
                    "type": "product",
                    "data": {
                        "id": product["id"],
                        "name": product["name"],
                        "price": product["price"],
                        "thumbnail": product["thumbnail"]
                    }
                })
            else:
                # Send barrage message
                await websocket.send_json({
                    "type": "barrage",
                    "data": {
                        "user": random.choice(BARRAGE_USERS),
                        "message": random.choice(BARRAGE_MSGS),
                        "color": f"hsl({random.randint(0,360)},70%,70%)"
                    }
                })

            # Occasionally send a purchase notification
            if random.random() < 0.15:
                p = random.choice(products)
                await websocket.send_json({
                    "type": "purchase",
                    "data": {
                        "user": random.choice(BARRAGE_USERS),
                        "product": p["name"],
                        "price": p["price"]
                    }
                })
    except WebSocketDisconnect:
        pass


# ──────────────────────────────────
# Health check
# ──────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "app": "百邑酒世界", "version": "0.1.0"}


# ──────────────────────────────────
# 高德 Web服务 API（服务端代理）
# Key: 46836207780b597bbc862c54f240f120
# 前端调用此接口，Key 不暴露给浏览器
# ──────────────────────────────────
AMAP_KEY = os.getenv("AMAP_WEB_SERVICE_KEY", "46836207780b597bbc862c54f240f120")
AMAP_BASE = "https://restapi.amap.com/v3"


@app.get("/api/route/drive")
async def get_drive_route(
    origin_lng: float = Query(..., description="起点经度"),
    origin_lat: float = Query(..., description="起点纬度"),
    dest_lng: float   = Query(..., description="终点经度"),
    dest_lat: float   = Query(..., description="终点纬度"),
):
    """
    高德驾车路线规划 —— 骑手配送路线预估
    返回：距离(km)、预计时长(分钟)、路线策略
    """
    url = (
        f"{AMAP_BASE}/direction/driving"
        f"?key={AMAP_KEY}"
        f"&origin={origin_lng},{origin_lat}"
        f"&destination={dest_lng},{dest_lat}"
        f"&extensions=base"
        f"&output=json"
    )
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url)
        data = resp.json()

    if data.get("status") != "1" or not data.get("route", {}).get("paths"):
        raise HTTPException(status_code=502, detail=f"高德路线规划失败: {data.get('info')}")

    path = data["route"]["paths"][0]
    distance_m = int(path.get("distance", 0))
    duration_s = int(path.get("duration", 0))

    return {
        "distance_km":   round(distance_m / 1000, 2),
        "duration_min":  round(duration_s / 60, 1),
        "tolls_yuan":    path.get("tolls", "0"),
        "strategy":      path.get("strategy", ""),
        "steps_count":   len(path.get("steps", [])),
    }


@app.get("/api/geocode")
async def geocode_address(address: str = Query(..., description="地址字符串")):
    """
    高德地理编码 —— 地址转经纬度
    """
    url = (
        f"{AMAP_BASE}/geocode/geo"
        f"?key={AMAP_KEY}"
        f"&address={address}"
        f"&city=广州"
        f"&output=json"
    )
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url)
        data = resp.json()

    if data.get("status") != "1" or not data.get("geocodes"):
        raise HTTPException(status_code=502, detail="地理编码失败")

    geo = data["geocodes"][0]
    lng, lat = geo["location"].split(",")
    return {
        "address":    geo.get("formatted_address"),
        "lat":        float(lat),
        "lng":        float(lng),
        "level":      geo.get("level"),
    }


@app.get("/api/nearby/stores")
async def nearby_pois(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = Query(3000, le=50000, description="搜索半径(米)"),
):
    """
    高德周边搜索 —— 搜索附近烟酒类 POI（类型: 050200 烟酒茶食）
    与 mock stores 结合使用，Phase 1 替换 mock 数据
    """
    url = (
        f"{AMAP_BASE}/place/around"
        f"?key={AMAP_KEY}"
        f"&location={lng},{lat}"
        f"&types=050200"
        f"&radius={radius}"
        f"&sortrule=distance"
        f"&output=json"
        f"&offset=20"
    )
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url)
        data = resp.json()

    if data.get("status") != "1":
        # 失败时回退到 mock 数据
        return stores_data["stores"]

    pois = data.get("pois", [])
    return [
        {
            "id":          f"amap-{p['id']}",
            "name":        p.get("name"),
            "address":     p.get("address"),
            "lat":         float(p["location"].split(",")[1]),
            "lng":         float(p["location"].split(",")[0]),
            "distance_km": round(int(p.get("distance", 0)) / 1000, 2),
            "tel":         p.get("tel", ""),
            "rating":      p.get("biz_ext", {}).get("rating", "4.5"),
            "status":      "营业中",
            "hours":       "09:00 - 22:00",
            "delivery_time": f"{max(20, int(p.get('distance', 3000)) // 200)}分钟",
            "min_order":   100,
            "tags":        ["实体酒行", "高德认证"],
            "video_url":   None,
            "logo":        "/stores/default.jpg",
        }
        for p in pois
    ]
