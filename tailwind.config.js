/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        mint: '#A7F3D0',
        lightGreen: '#86EFAC',
        sageGreen: '#88B04B',
        emerald: '#10B981',
        softEmerald: '#34D399',
        cream: '#FFFDD0',
        softYellow: '#FEF08A'
      }
    },
  },
  plugins: [],
}
