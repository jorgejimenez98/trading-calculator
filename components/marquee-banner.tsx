"use client"

import { useState, useEffect } from "react"
import Marquee from "react-fast-marquee"

const marqueeTexts = [
  "Trust Commander Professor Anthony 🚀",
  "We'll be millionaires soon! 💰",
  "Buying a Miata next week 🏎️",
  "Credit cards will be paid off! 💳",
  "800k coming soon! 📈",
  "Lambos for everyone! 🏎️✨",
  "Retirement at 25! 🏖️",
  "To the moon and beyond! 🌙🚀",
  "Yacht shopping this weekend! ⛵",
  "Private jet incoming! ✈️💸",
  "Mansion hunting starts tomorrow! 🏰",
  "Caviar for breakfast! 🍾",
  "Golden toilet seats! 🚽✨",
  "Swimming in money! 💰🏊‍♂️",
  "Buying the dip forever! 📉💪",
  "HODL until we're rich! 💎🙌",
  "Compound interest is magic! ✨📊",
  "Anthony's signals never fail! 📡💯",
  "Financial freedom loading... ⏳💰",
  "Diamond hands forever! 💎",
]

export function MarqueeBanner() {
  const [currentTexts, setCurrentTexts] = useState(marqueeTexts.slice(0, 5))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTexts((prev) => {
        const startIndex = Math.floor(Math.random() * (marqueeTexts.length - 5))
        return marqueeTexts.slice(startIndex, startIndex + 5)
      })
    }, 8000) // Change texts every 8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 dark:from-green-600 dark:via-blue-600 dark:to-purple-600 py-3 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
      <div className="relative">
        <Marquee speed={50} gradient={false} pauseOnHover={true} className="text-white font-bold text-sm sm:text-base">
          {currentTexts.map((text, index) => (
            <span key={`${text}-${index}`} className="mx-8 whitespace-nowrap">
              {text}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
