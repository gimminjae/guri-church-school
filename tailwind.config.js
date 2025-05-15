// import type { Config } from "tailwindcss"

const config = {
  content: ["./src/**/*.{html,js,tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"), // 추가
    require('tailwindcss-animated')
  ],
}
export default config
