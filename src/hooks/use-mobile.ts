"use client"

import { useMediaQuery } from "./use-media-query"

export const useMobile = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  return !isDesktop;
}
