import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Replaces the mouse cursor with a little electric boat that glides after the
 * pointer and turns to face the direction it's moving. The water background
 * ripples on pointer move by itself, so the boat leaves a wake for free.
 *
 * Only active on devices with a mouse or trackpad ("pointer: fine"). On touch
 * screens it renders nothing. The native cursor is hidden by the
 * `pointer-fine:` classes on the page root in MeetTheTeam.tsx.
 */
export default function BoatCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const reduceMotion = useReducedMotion();

  // Raw pointer position, plus a springy follower so the boat glides instead of snapping.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 450, damping: 35 });
  const springY = useSpring(y, { stiffness: 450, damping: 35 });

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      // Ignore tiny jitters so the boat doesn't flip back and forth.
      const dx = e.clientX - lastX;
      if (Math.abs(dx) > 2) setFacingLeft(dx < 0);
      lastX = e.clientX;
    };
    // Hide the boat when the pointer leaves the window.
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{
        x: reduceMotion ? x : springX,
        y: reduceMotion ? y : springY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {/* Flips to face the direction of travel, and bobs gently */}
      <motion.div
        animate={{
          scaleX: facingLeft ? -1 : 1,
          ...(reduceMotion ? {} : { y: [0, -2, 0], rotate: [0, 2, 0] }),
        }}
        transition={{
          scaleX: { type: "spring", stiffness: 300, damping: 20 },
          y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <svg width="52" height="28" viewBox="0 0 64 34" style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.45))" }}>
          {/* Cabin */}
          <rect x="22" y="6" width="20" height="10" rx="3" fill="#dce8ef" />
          <rect x="26" y="9" width="5" height="4" rx="1" fill="#4e8bb1" />
          <rect x="33" y="9" width="5" height="4" rx="1" fill="#4e8bb1" />
          {/* Hull, with the bow (pointed end) on the right */}
          <path d="M4 16 H62 L52 28 H10 Z" fill="#ee4450" />
          <path d="M4 16 H62 L60 19 H5.5 Z" fill="#f8ca6d" />
          {/* Lightning bolt, for the electric part */}
          <path d="M33 20 L29 25 H32 L30 29 L36 23 H33 L35 20 Z" fill="#ffd60a" />
        </svg>
      </motion.div>
    </motion.div>
  );
}