/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#0f0e0d",
          2: "#171513",
          3: "#221f1c",
          4: "#2e2a26",
        },
        fg: "#efe9df",
        mute: "#a59f95",
        line: "rgba(242, 237, 227, 0.12)",
        board: {
          DEFAULT: "#f2ede3",
          ink: "#141210",
          groove: "#d8d0c1",
        },
        marquee: {
          DEFAULT: "#e3262f",
          hot: "#f0353e",
        },
        bulb: "#f5b942",
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', "Impact", "sans-serif"],
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "1440px",
      },
    },
  },
  plugins: [],
};
