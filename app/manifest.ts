import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mantle Meow",
    short_name: "Mantle Meow",
    description: "Raise a personalized AI Intern Cat that researches Mantle and on-chain signals with you.",
    start_url: "/",
    display: "standalone",
    background_color: "#04110d",
    theme_color: "#74f7c7",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
