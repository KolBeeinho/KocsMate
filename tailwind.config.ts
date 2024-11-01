import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "oxford-blue": "#141e30ff",
        "desert-sand": "#dec5b4ff",
        glaucous: "#6f7fa7ff",
        "dark-red": "#910002ff",
        "betu-szin": "#eee5ceff",
        butterscotch: "#df932aff",
        "yinmn-blue": "#2f5479ff",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
