'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './AMapContainer.module.css';

// Default center: Guangzhou Tianhe
const DEFAULT_CENTER = [23.1291, 113.3272];
const DEFAULT_ZOOM = 13;

// Custom gold pin SVG for store markers
const PIN_SVG = (label) => `
<div style="
  display:flex;flex-direction:column;align-items:center;cursor:pointer;
">
  <div style="
    background:linear-gradient(135deg,#C8A96E,#8B6914);
    color:#0A0806;
    padding:5px 10px;
    border-radius:20px;
    font-size:11px;
    font-weight:700;
    white-space:nowrap;
    box-shadow:0 4px 16px rgba(200,169,110,0.6);
    border:1px solid rgba(255,220,120,0.5);
  ">${label}</div>
  <div style="
    width:0;height:0;
    border-left:6px solid transparent;
    border-right:6px solid transparent;
    border-top:8px solid #C8A96E;
    margin-top:-1px;
  "></div>
</div>`;

export default function LeafletMap({ stores = [], onStoreSelect }) {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const [ready, setReady] = useState(false);

  // Dynamically load Leaflet CSS + JS once
  useEffect(() => {
    if (window.L) { setReady(true); return; }

    // Inject Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Inject Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);

    return () => { /* keep CSS/JS loaded for map reuse */ };
  }, []);

  // Initialize map once Leaflet is ready
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;

    const L = window.L;

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    // Dark tile layer — Carto Dark Matter (free, no key)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    mapInstance.current = map;
  }, [ready]);

  // Add / refresh markers whenever stores change
  useEffect(() => {
    if (!ready || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    stores.forEach((store, idx) => {
      const shortName = store.name.split('·')[1]?.trim() ?? store.name;
      const icon = L.divIcon({
        className: '',
        html: PIN_SVG(`🏪 ${shortName}`),
        iconSize: [null, null],
        iconAnchor: [0, 36],
        popupAnchor: [60, -36],
      });

      const marker = L.marker([store.lat, store.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:180px">
            <strong style="color:#C8A96E">${store.name}</strong><br/>
            <small style="color:#888">${store.address}</small><br/>
            <span style="color:#27AE60;font-size:12px">⏱ ${store.delivery_time} · ⭐${store.rating}</span>
          </div>
        `, { className: styles.popup });

      marker.on('click', () => {
        onStoreSelect?.(store);
        map.setView([store.lat, store.lng], 15, { animate: true });
      });

      markersRef.current.push(marker);

      // Auto-open first store popup
      if (idx === 0) setTimeout(() => marker.openPopup(), 600);
    });

    // Fit map to all markers
    if (stores.length > 1) {
      const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [ready, stores]);

  return (
    <div className={styles.wrapper}>
      {/* Dark overlay grid before map loads */}
      {!ready && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>地图加载中…</span>
        </div>
      )}
      <div ref={mapRef} className={styles.map} />
    </div>
  );
}
