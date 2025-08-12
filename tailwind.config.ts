import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "scroll-seamless": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-12.5%)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pump-1": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pump-2": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pump-3": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "fuel-flow": {
          "0%": { height: "0%" },
          "50%": { height: "100%" },
          "100%": { height: "0%" },
        },
        "swing-1": {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        "swing-2": {
          "0%, 100%": { transform: "rotate(3deg)" },
          "50%": { transform: "rotate(-3deg)" },
        },
        "swing-3": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        "car-journey": {
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        "road-draw": {
          "0%": { strokeDasharray: "0 2000" },
          "100%": { strokeDasharray: "2000 0" },
        },
        "road-markings": {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-40" },
        },
        "station-appear": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "savings-popup": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "star-glow": {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.1)", filter: "brightness(1.2)" },
        },
        "droplet-form": {
          "0%": {
            transform: "scale(0)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "droplet-fall": {
          "0%": { transform: "translateY(0) translateZ(0)" },
          "100%": { transform: "translateY(380px) translateZ(0)" },
        },
        "puddle-appear": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "80%": { opacity: "0", transform: "scale(0)" },
          "85%": { opacity: "0.7", transform: "scale(1.2)" },
          "90%": { opacity: "0.4", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scroll: "scroll 20s linear infinite",
        "scroll-seamless": "scroll-seamless 30s linear infinite",
        "bounce-in": "bounce-in 0.6s ease-out",
        "pump-1": "pump-1 2s ease-in-out infinite",
        "pump-2": "pump-2 2.5s ease-in-out infinite",
        "pump-3": "pump-3 1.8s ease-in-out infinite",
        "fuel-flow": "fuel-flow 3s ease-in-out infinite",
        "swing-1": "swing-1 2s ease-in-out infinite",
        "swing-2": "swing-2 2.3s ease-in-out infinite",
        "swing-3": "swing-3 1.7s ease-in-out infinite",
        "car-journey": "car-journey 5s ease-in-out infinite",
        "road-draw": "road-draw 3s ease-out forwards",
        "road-markings": "road-markings 2s linear infinite",
        "station-appear": "station-appear 0.8s ease-out forwards",
        "savings-popup": "savings-popup 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in-down": "fade-in-down 0.8s ease-out forwards",
        "star-glow": "star-glow 2s ease-in-out infinite",
        "droplet-form": "droplet-form 0.4s ease-out forwards",
        "droplet-fall": "droplet-fall 2s linear forwards",
        "puddle-appear": "puddle-appear 3s ease-out forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".transform-style-preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
      });
    },
  ],
} satisfies Config;
