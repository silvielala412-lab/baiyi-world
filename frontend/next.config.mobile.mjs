/**
 * next.config.mobile.mjs
 * 专门用于移动端 APK 打包的 Next.js 配置
 * 不影响原有的 next.config.mjs
 *
 * 使用方式：
 *   cross-env NEXT_CONFIG_FILE=next.config.mobile.mjs next build
 * 或者通过 mobile/build-apk.ps1 自动调用
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // 静态导出，无需 Node.js 服务器
  trailingSlash: true,     // Capacitor WebView 需要目录式路由
  images: {
    unoptimized: true,     // 静态导出必须禁用图片优化
  },
  // 静态导出不支持 rewrites，API 自动 fallback 到 mock 数据
  env: {
    NEXT_PUBLIC_API_URL: '',  // 留空 → api.js 自动走 mock 分支
  },
};

export default nextConfig;
