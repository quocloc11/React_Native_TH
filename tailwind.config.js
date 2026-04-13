// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   // Trỏ đúng vào thư mục chứa code của bạn (ví dụ: src)
//   content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: '#3b82f6', // blue-500
//           dark: '#1d4ed8',    // blue-700
//         },
//         secondary: '#10b981', // emerald-500
//         error: '#ef4444',     // red-500
//         success: '#22c55e',   // green-500
//       },
//       fontFamily: {
//         // Cấu hình font ở đây nếu dự án có custom font
//         sans: ['System'],
//       }
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  // Trỏ đúng vào thư mục chứa code của bạn
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // BẮT BUỘC PHẢI CÓ DÒNG NÀY CHO NATIVEWIND V4
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}