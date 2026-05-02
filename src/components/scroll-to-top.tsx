import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** Resets scroll position when the route path changes. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    const inset = document.querySelector<HTMLElement>('[data-slot="sidebar-inset"]')
    if (inset) inset.scrollTop = 0
  }, [pathname])

  return null
}
