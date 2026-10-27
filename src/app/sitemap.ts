import type { MetadataRoute } from "next"
import { ROUTES, SITE_URL } from "@/content/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({ url: `${SITE_URL}${r.path === "/" ? "" : r.path}` }))
}
