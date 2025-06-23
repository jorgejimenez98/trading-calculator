'use client'

import { useEffect, useState } from 'react'

export function InstallPromptButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    const promptEvent = deferredPrompt as any
    promptEvent.prompt()

    const result = await promptEvent.userChoice
    console.log('User choice:', result.outcome)

    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setShowInstallButton(false)
    setDeferredPrompt(null)
  }

  if (!showInstallButton) return null

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md z-50"
    >
      Install App
    </button>
  )
}
