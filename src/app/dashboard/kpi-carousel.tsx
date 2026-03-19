'use client'

import { useRef, useState, useEffect } from 'react'

export function KpiCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalCards = 4

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth * 0.75 + 12 // 75vw + gap
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(index, totalCards - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide"
      >
        {children}
      </div>
      {/* Animated dots */}
      <div className="flex justify-center gap-1.5 mt-1 mb-2">
        {Array.from({ length: totalCards }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-6 bg-[#09B1BA]'
                : 'w-1.5 bg-slate-300 dark:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
