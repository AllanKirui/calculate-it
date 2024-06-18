import { defineConfig } from "vite"

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/calculate-it/" : "/"
})
