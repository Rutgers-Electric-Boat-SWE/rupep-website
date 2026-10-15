import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import type { Accent, TeamMember } from "./team-data";

// Diameter of the porthole in px. Everything inside scales from this.
const SIZE = 200;
// How far the face warps at the peak of a ripple (SVG displacement scale, in px).
const RIPPLE_STRENGTH = 14;

// Brass tones, taken from the papaya-whip scale in index.css.
const BRASS = {
  light: "#fdedce", // papaya-whip-100
  mid: "#f8ca6d", // papaya-whip-300
  deep: "#c38509", // papaya-whip-600
  dark: "#926407", // papaya-whip-700
};
const WATER = "rgba(0, 133, 204, 0.88)"; // deep-space-blue-600

interface PortholeCardProps {
  member: TeamMember;
  accent: Accent;
}

/**
 * A brass porthole with a member's face behind the glass.
 * On hover, the face ripples like it's underwater and water rises to fill the
 * porthole, carrying the fun fact. On leave, the water drains.
 *
 * Interaction:
 *   - Mouse: hover to fill, leave to drain.
 *   - Touch: tap to toggle, because touch screens have no hover.
 *   - Keyboard: Tab to focus, then Enter or Space to toggle.
 *
 * Note: this is a <div role="button"> rather than a <button>, because index.css
 * gives every <button> clay shadows and an !important border-radius.
 */
export default function PortholeCard({ member, accent }: PortholeCardProps) {
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
    <div className="flex w-[220px] flex-col items-center gap-(--s4)">
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
        {/* Brass frame: a conic gradient fakes polished metal, and the radial
            highlight on top gives it a light source */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 22%, ${BRASS.light}, transparent 45%),
              conic-gradient(from 200deg, ${BRASS.dark}, ${BRASS.mid}, ${BRASS.deep}, ${BRASS.light}, ${BRASS.dark}, ${BRASS.mid}, ${BRASS.dark})`,
            boxShadow:
              "inset 0 3px 4px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.35), 0 var(--lip) 0 rgba(0,0,0,0.3), 0 16px 32px rgba(0,0,0,0.45)",
          }}
        />

        {/* Rivets: each one is rotated around the center, then pushed out onto the frame */}
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${SIZE * 0.425}px)`,
              background: `radial-gradient(circle at 35% 30%, ${BRASS.light}, ${BRASS.deep} 60%, ${BRASS.dark})`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          />
        ))}

        {/* Glass. The thin ring in the section's accent color acts as the gasket. */}
        <div
          className="absolute inset-[15%] overflow-hidden rounded-full bg-steel-blue-900"
          style={{
            boxShadow: `0 0 0 3px ${accentColor}, inset 0 6px 14px rgba(0,0,0,0.55)`,
          }}
        >
          {photoFailed ? (
            <div
              className="flex h-full w-full items-center justify-center text-4xl text-(--on-accent)"
              style={{ backgroundColor: accentColor }}
            >
              {initials}
            </div>
          ) : (
            <img
              src={member.photo}
              alt={member.name}
              className="h-full w-full object-cover"
              style={{ filter: `url(#${filterId})` }}
              draggable={false}
              onError={() => setPhotoFailed(true)}
            />
          )}

          {/* Ripple rings. They remount each time the porthole fills, so they replay. */}
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
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-(--s1) p-(--s5) text-center text-papaya-whip-50"
            initial={false}
            animate={{ opacity: filled ? 1 : 0, y: filled ? 0 : 8 }}
            transition={{ duration: 0.3, delay: filled && !reduceMotion ? 0.35 : 0 }}
          >
            <span className="text-[10px] tracking-widest uppercase opacity-80">Fun fact</span>
            <p className="m-0 text-xs leading-snug">{member.funFact}</p>
          </motion.div>

          {/* Glare across the glass, on top of everything */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 28%, transparent 40%, transparent 70%, rgba(255,255,255,0.1) 85%)",
            }}
          />
        </div>
      </div>

      {/* Name and role */}
      <div className="flex flex-col items-center gap-(--s1) text-center">
        <span className="text-lg text-papaya-whip-50">{member.name}</span>
        <span
          className="rounded-full px-(--s3) py-(--s1) text-xs text-(--on-accent)"
          style={{ backgroundColor: accentColor }}
        >
          {member.role}
        </span>
      </div>
    </div>
  );
}
