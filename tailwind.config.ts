import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    DEFAULT: "#2A7A3B",
                    dark: "#1C5228",
                    deeper: "#153D1E",
                    mid: "#3A9E52",
                    light: "#5CBF72",
                    pale: "#EAF5EC",
                    xpale: "#F4FBF5",
                },
                ink: {
                    DEFAULT: "#111B13",
                    2: "#2B3D2E",
                },
                muted: "#637566",
                border: {
                    DEFAULT: "#DAEADD",
                    2: "#C5DFC9",
                },
                gold: "#D4A520",
            },
            fontFamily: {
                outfit: ["var(--font-outfit)", "sans-serif"],
                jakarta: ["var(--font-jakarta)", "sans-serif"],
            },
            borderRadius: {
                "2xl": "16px",
            },
        },
    },
    plugins: [],
};
export default config;
