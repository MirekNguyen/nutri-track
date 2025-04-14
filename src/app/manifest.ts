import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NutriTrack',
    short_name: 'NutriTrack',
    description: 'App to track your nutrition and calories',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
