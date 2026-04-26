"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only track if it's not an admin page to avoid polluting stats
    if (!pathname.startsWith("/admin")) {
      import("@/actions/analytics").then(({ trackPageView }) => {
        trackPageView(pathname)
      }).catch(console.error)
    }
  }, [pathname])

  return null
}
