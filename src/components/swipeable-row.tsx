'use client'

import { useRef, useState, useCallback, type ReactNode } from 'react'

interface SwipeAction {
  icon: ReactNode
  label: string
  color: string
  onAction: () => void
}

interface SwipeableRowProps {
  children: ReactNode
  leftAction?: SwipeAction
  rightAction?: SwipeAction
}

const THRESHOLD = 70
const MAX_SWIPE = 90

export function SwipeableRow({ children, leftAction, rightAction }: SwipeableRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const currentX = useRef(0)
  const swiping = useRef(false)
  const locked = useRef(false)
  const [offset, setOffset] = useState(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    swiping.current = false
    locked.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    // Lock direction on first significant move
    if (!locked.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      locked.current = true
      swiping.current = Math.abs(dx) > Math.abs(dy)
    }

    if (!swiping.current) return

    e.preventDefault()

    // Clamp swipe range
    let clamped = dx
    if (dx > 0 && !leftAction) clamped = 0
    if (dx < 0 && !rightAction) clamped = 0
    clamped = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, clamped))

    currentX.current = clamped
    setOffset(clamped)
  }, [leftAction, rightAction])

  const handleTouchEnd = useCallback(() => {
    if (!swiping.current) {
      setOffset(0)
      return
    }

    const dx = currentX.current

    if (dx > THRESHOLD && leftAction) {
      // Animate out then trigger
      setOffset(MAX_SWIPE)
      setTimeout(() => {
        leftAction.onAction()
        setOffset(0)
      }, 200)
    } else if (dx < -THRESHOLD && rightAction) {
      setOffset(-MAX_SWIPE)
      setTimeout(() => {
        rightAction.onAction()
        setOffset(0)
      }, 200)
    } else {
      setOffset(0)
    }

    swiping.current = false
    currentX.current = 0
  }, [leftAction, rightAction])

  const progress = Math.min(Math.abs(offset) / THRESHOLD, 1)
  const isLeft = offset > 0
  const activeAction = isLeft ? leftAction : rightAction

  return (
    <div className="relative overflow-hidden rounded-xl" ref={containerRef}>
      {/* Background action indicator */}
      {activeAction && offset !== 0 && (
        <div
          className={`absolute inset-0 flex items-center ${isLeft ? 'justify-start pl-5' : 'justify-end pr-5'} rounded-xl`}
          style={{ backgroundColor: activeAction.color }}
        >
          <div
            className="flex flex-col items-center gap-0.5 text-white"
            style={{ opacity: progress, transform: `scale(${0.5 + progress * 0.5})` }}
          >
            {activeAction.icon}
            <span className="text-[9px] font-bold uppercase tracking-wide">{activeAction.label}</span>
          </div>
        </div>
      )}

      {/* Swipeable content */}
      <div
        className="relative z-10 touch-pan-y"
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping.current ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
