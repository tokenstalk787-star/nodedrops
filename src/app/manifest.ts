
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NodeDrops.xyz",
    short_name: "NodeDrops",
    description:
      "Discover blockchain testnets, node programs, and developer opportunities.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
  };
}
