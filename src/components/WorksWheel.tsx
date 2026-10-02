"use client"

import * as React from "react"
import { cn } from "../lib/utils"

export interface WorksWheelItem {
  title: string
  image: string
  href?: string
}

export interface WorksWheelProps
  extends Omit<
    React.ComponentPropsWithoutRef<"section">,
    "children"
  > {
  items: WorksWheelItem[]
  label?: string
  center?: React.ReactNode
}

// Card size
const CARD_WIDTH = 380
const CARD_HEIGHT = 250

// Ring layout
const RING_RADIUS = 320 // max radius, shrinks automatically on small screens
const RING_SCALE = 0.55 // card size in the ring
const RING_EDGE_PADDING = 28 // min gap between ring cards and screen edge

// Intro reveal timing (ms)
const REVEAL_DELAY = 400
const REVEAL_STAGGER = 220
const REVEAL_DURATION = 700

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * t

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function WorksWheel({
  items,
  label = "Works '26",
  center,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLElement | null)[]>([])

  const count = items.length

  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )

    const read = () => setReduced(query.matches)

    read()

    query.addEventListener("change", read)

    return () => {
      query.removeEventListener("change", read)
    }
  }, [])

  React.useEffect(() => {
    const el = stageRef.current

    if (!el) return

    let frame = 0
    const startTime = performance.now()

    const draw = () => {
      frame = requestAnimationFrame(draw)

      const elapsed = performance.now() - startTime

      // Ring radius adapts so the ring always fits on screen
      const ringCardSize =
        Math.max(CARD_WIDTH, CARD_HEIGHT) * RING_SCALE
      const fitRadius =
        Math.min(el.clientWidth, el.clientHeight) / 2 -
        ringCardSize / 2 -
        RING_EDGE_PADDING
      const ringR = clamp(fitRadius, 120, RING_RADIUS)

      for (let i = 0; i < count; i++) {
        const card = cardRefs.current[i]

        if (!card) continue

        // Staggered intro: 0 -> 1 per card
        const reveal = reduced
          ? 1
          : easeOutCubic(
              clamp(
                (elapsed -
                  REVEAL_DELAY -
                  i * REVEAL_STAGGER) /
                  REVEAL_DURATION,
                0,
                1
              )
            )

        const ringDeg = i * (360 / count)

        card.style.transform =
          `rotateZ(${ringDeg}deg) translateY(${-ringR}px)`

        card.style.opacity = String(reveal)

        const face =
          card.firstElementChild as HTMLElement | null

        if (face) {
          // Pop in from slightly smaller
          face.style.transform = `scale(${
            RING_SCALE * lerp(0.6, 1, reveal)
          })`
        }
      }
    }

    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [count, reduced])

  return (
    <section
      aria-label={label}
      className={cn(
        "relative h-screen min-h-screen w-full overflow-hidden select-none bg-transparent text-white",
        className
      )}
      {...props}
    >
      {/* Static ring of cards (no interaction) */}
      <div
        ref={stageRef}
        role="list"
        aria-label={label}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-1/2">
          {items.map((item, i) => (
            <div
              key={item.title}
              role="listitem"
              ref={(node) => {
                cardRefs.current[i] = node
              }}
              className="absolute opacity-0"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                marginLeft: -CARD_WIDTH / 2,
                marginTop: -CARD_HEIGHT / 2,
              }}
            >
              <span
                className="
                  relative
                  block
                  size-full
                  overflow-hidden
                  rounded-[2rem]
                  bg-steel-blue-900
                  shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                "
              >
                <img
                  src={item.image}
                  alt={item.title}
                  draggable={false}
                  className="
                    size-full
                    object-cover
                  "
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Center content */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-50
          grid
          place-items-center
        "
      >
        {center ?? (
          <div className="tracking-tight text-white">
            {label}
          </div>
        )}
      </div>
    </section>
  )
}