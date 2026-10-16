import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import type { Accent, TeamMember } from "./team-data";

// Diameter of the ring in px. The hole, rope and text all scale from this.
const SIZE = 240;
// How far the face warps at the peak of a ripple (SVG displacement scale, in px).
const RIPPLE_STRENGTH = 16;
const WATER = "rgba(0, 133, 204, 0.88)"; // deep-space-blue-600
const ROPE = "#c38509"; // papaya-whip-600

// Ring tube: 8 alternating bands (accent / white), offset so a band sits at the top.
const bands = (color: string) => `conic-gradient(from -22.5deg,
  ${color} 0deg 45deg, #fff 45deg 90deg, ${color} 90deg 135deg, #fff 135deg 180deg,
  ${color} 180deg 225deg, #fff 225deg 270deg, ${color} 270deg 315deg, #fff 315deg 360deg)`;

// Dark at both edges and bright down the middle, so the ring reads as a round
// inflated tube instead of a flat disc. Stops are % of the ring's radius.
const TUBE_SHADING =
  "radial-gradient(circle closest-side, transparent 57%, rgba(0,0,0,0.4) 58.5%, rgba(255,255,255,0.3) 77%, rgba(0,0,0,0.45) 100%)";

// Shrinks longer fun facts so they still fit inside the hole.
// Past ~170 characters even the smallest size gets clipped, so keep facts short.
function factTextSize(fact: string) {
  if (fact.length <= 90) return "text-sm";
  if (fact.length <= 135) return "text-xs";
  return "text-[11px]";
}

interface LifeRingCardProps {
  member: TeamMember;
  accent: Accent;
  /** Show the role pill under the name. Off when the section title already says the role. */
  showRole?: boolean;
}

/**
 * A life ring floating on the water, with a member's face in the center.
 * On hover, the face ripples like it's underwater and water rises to fill the
 * hole, carrying the fun fact. On leave, the water drains.
 *
 * Interaction:
 *   - Mouse: hover to fill, leave to drain.
 *   - Touch: tap to toggle, because touch screens have no hover.
 *   - Keyboard: Tab to focus, then Enter or Space to toggle.
 *
 * Note: this is a <div role="button"> rather than a <button>, because index.css
 * gives every <button> clay shadows and an !important border-radius.
 */
export default function LifeRingCard({ member, accent, showRole = true }: LifeRingCardProps) {
  const [filled, setFilled] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  // Remembers what kind of pointer started the last click, so a mouse click
  // doesn't undo the hover state.
  const lastPointerType = useRef<string>("mouse");

  // Each card needs its own SVG filter id. useId() can contain characters
  // that break url(#...), so strip them.
  const filterId = `ripple-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  // Each ring bobs on its own rhythm, so a row of them doesn't move in lockstep.
  const [bobDuration] = useState(() => 3.5 + Math.random() * 1.5);

  // When the water rises, surge the underwater warp, then let it settle back to 0.
  useEffect(() => {
    const node = displacementRef.current;
    if (!filled || reduceMotion || !node) return;

    const controls = animate(0, 1, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (t) => node.setAttribute("scale", String(RIPPLE_STRENGTH * Math.sin(Math.PI * t))),
    });
    return () => {
      controls.stop();
      node.setAttribute("scale", "0");
    };
  }, [filled, reduceMotion]);

  const accentColor = `var(--${accent})`;
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex w-[260px] flex-col items-center gap-(--s4)">
      {/* Underwater warp: moving noise that displaces the photo's pixels.
          The scale stays at 0 (no warp) until the effect above animates it. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves={2} seed={3} result="noise">
            <animate
              attributeName="baseFrequency"
              dur="4s"
              values="0.015 0.04;0.02 0.06;0.015 0.04"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Gentle bob, like the ring is floating */}
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: bobDuration, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={filled}
          aria-label={`${member.name}, ${member.role}. Show fun fact`}
          className="relative cursor-pointer rounded-full outline-none focus-visible:ring-4 focus-visible:ring-(--purple)"
          style={{ width: SIZE, height: SIZE }}
          onPointerDown={(e) => {
            lastPointerType.current = e.pointerType;
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setFilled(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setFilled(false);
          }}
          onClick={() => {
            if (lastPointerType.current !== "mouse") setFilled((f) => !f);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFilled((f) => !f);
            }
          }}
        >
          {/* The tube: colored bands, with shading layered on top */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `${TUBE_SHADING}, ${bands(accentColor)}`,
              boxShadow: "0 var(--lip) 0 rgba(0,0,0,0.25), 0 18px 36px rgba(0,0,0,0.45)",
            }}
          />

          {/* Rope: a dashed loop just outside the tube, lashed down at the four white bands */}
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="51" fill="none" stroke={ROPE} strokeWidth="1.6" strokeDasharray="2.4 1.2" />
            {[45, 135, 225, 315].map((angle) => (
              <line
                key={angle}
                x1="50"
                y1="-2"
                x2="50"
                y2="22"
                stroke={ROPE}
                strokeWidth="2.2"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>

          {/* The hole in the middle, where the face sits */}
          <div
            className="absolute inset-[21%] overflow-hidden rounded-full bg-steel-blue-900"
            style={{ boxShadow: "inset 0 6px 14px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.6)" }}
          >
            {photoFailed ? (
              <div
                className="flex h-full w-full items-center justify-center text-5xl text-(--on-accent)"
                style={{ backgroundColor: accentColor }}
              >
                {initials}
              </div>
            ) : (
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full object-cover"
                style={{
                  filter: `url(#${filterId})`,
                  // Faces usually sit in the upper part of a photo, so aim there by default.
                  // photoPosition and photoZoom in team-data.ts fine-tune individual photos.
                  objectPosition: member.photoPosition ?? "50% 25%",
                  transform: `scale(${member.photoZoom ?? 1})`,
                  transformOrigin: member.photoPosition ?? "50% 25%",
                }}
                draggable={false}
                onError={() => setPhotoFailed(true)}
              />
            )}

            {/* Ripple rings. They remount each time the hole fills, so they replay. */}
            {filled &&
              !reduceMotion &&
              [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/70"
                  initial={{ scale: 0.15, opacity: 0.8 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 1.1, delay: i * 0.18, ease: "easeOut" }}
                />
              ))}

            {/* Rising water. The wave strip on top scrolls sideways forever,
                so the surface looks like it's moving. */}
            <motion.div
              className="absolute inset-x-0 bottom-0"
              style={{ backgroundColor: WATER }}
              initial={false}
              animate={{ height: filled ? "100%" : "0%" }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
            >
              <div className="absolute -top-[10px] left-0 h-[12px] w-[200%] overflow-hidden">
                <motion.svg
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                >
                  <path
                    d="M0 6 Q12.5 0 25 6 T50 6 T75 6 T100 6 T125 6 T150 6 T175 6 T200 6 V12 H0 Z"
                    fill={WATER}
                  />
                </motion.svg>
              </div>
            </motion.div>

            {/* Fun fact floats in once the water is mostly up */}
            <motion.div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-(--s1) p-(--s4) text-center text-papaya-whip-50"
              initial={false}
              animate={{ opacity: filled ? 1 : 0, y: filled ? 0 : 8 }}
              transition={{ duration: 0.3, delay: filled && !reduceMotion ? 0.35 : 0 }}
            >
              <span className="text-[11px] tracking-widest uppercase opacity-80">Fun fact</span>
              <p className={`m-0 leading-snug ${factTextSize(member.funFact)}`}>{member.funFact}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Name, plus role when the section title doesn't already say it */}
      <div className="flex flex-col items-center gap-(--s1) text-center">
        <span className="text-xl text-papaya-whip-50">{member.name}</span>
        {showRole && (
          <span
            className="rounded-full px-(--s3) py-(--s1) text-sm text-(--on-accent)"
            style={{ backgroundColor: accentColor }}
          >
            {member.role}
          </span>
        )}
      </div>
    </div>
  );
}