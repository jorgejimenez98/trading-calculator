import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LWEX Trading Calculator',
    short_name: 'LWEX Calc',
    description: 'Advanced trading calculator to compute profits, losses, position sizes, and risk management for traders.',
    start_url: '/',
    display: 'standalone',
    background_color: '#9333ea',
    theme_color: '#9333ea',
    icons: [
      {
        purpose: 'maskable',
        sizes: '1024x1024',
        src: '/icons/maskable_icon.png',
        type: 'image/png'
      },
      {
        purpose: 'maskable',
        sizes: '48x48',
        src: '/icons/maskable_icon_x48.png',
        type: 'image/png'
      },
      {
        purpose: 'maskable',
        sizes: '72x72',
        src: '/icons/maskable_icon_x72.png',
        type: 'image/png'
      },
      {
        purpose: 'maskable',
        sizes: '96x96',
        src: '/icons/maskable_icon_x96.png',
        type: 'image/png'
      },
      {
        purpose: 'maskable',
        sizes: '128x128',
        src: '/icons/maskable_icon_x128.png',
        type: 'image/png'
      },
      {
        purpose: 'maskable',
        sizes: '192x192',
        src: '/icons/maskable_icon_x192.png',
        type: 'image/png'
      },
      {
        purpose: 'maskable',
        sizes: '384x384',
        src: '/icons/maskable_icon_x384.png',
        type: 'image/png'
      },
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: '/icons/maskable_icon_x512.png',
        type: 'image/png'
      }
    ]
  }
}
