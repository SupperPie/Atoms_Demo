import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 供 Docker 部署使用：构建产物输出为独立运行包，镜像中无需再安装依赖
  output: "standalone",
};

export default nextConfig;
