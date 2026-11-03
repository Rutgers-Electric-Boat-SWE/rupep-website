import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* ---------------------------------------------------------
   Tuning knobs
   --------------------------------------------------------- */
// Each simulation cell covers CELL x CELL screen pixels. Bigger = faster but softer.
const CELL = 4;
// How quickly ripples fade (closer to 1 = ripples travel further).
const DAMPING = 0.965;
// How strongly the slope of the water lightens or darkens the color.
const SHADE = 0.12;
// Disturbance strength for each kind of input.
const TAP_STRENGTH = 500;
const MOVE_STRENGTH = 60;
const AMBIENT_STRENGTH = 220;
// Milliseconds between the random "raindrop" ripples that keep the water alive.
const AMBIENT_INTERVAL = 1400;
// Water color at the top and bottom of the screen (deep-space-blue-800 to 950).
const TOP_RGB = [0, 66, 102];
const BOTTOM_RGB = [0, 23, 36];

/**
 * Full-screen interactive water surface. Moving the pointer leaves a light
 * wake, and tapping or clicking drops a bigger ripple.
 *
 * How it works: the classic two-buffer ripple simulation. Each cell stores a
 * water height, and every frame a cell's next height comes from its neighbors'
 * current heights minus its own previous height. The surface is drawn by
 * shading each cell by its slope, at low resolution, and the canvas is
 * stretched to fill the screen (the browser smooths it).
 *
 * Listens on window, so the cards and text on top can stay interactive and
 * still ripple the water beneath them. With reduced motion turned on, it
 * renders a still surface.
 */
export default function WaterBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let current = new Float32Array(0);
    let previous = new Float32Array(0);
    let image = ctx.createImageData(1, 1);
    let rowColors = new Float32Array(0); // base RGB for each row (the depth gradient)

    // Rebuilds the simulation grid to match the canvas's on-screen size.
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(3, Math.ceil(rect.width / CELL));
      h = Math.max(3, Math.ceil(rect.height / CELL));
      canvas.width = w;
      canvas.height = h;
      current = new Float32Array(w * h);
      previous = new Float32Array(w * h);
      image = ctx.createImageData(w, h);
      rowColors = new Float32Array(h * 3);
      for (let y = 0; y < h; y++) {
        const t = y / (h - 1);
        for (let c = 0; c < 3; c++) {
          rowColors[y * 3 + c] = TOP_RGB[c] + (BOTTOM_RGB[c] - TOP_RGB[c]) * t;
        }
      }
    };

    // Pushes the water down in a small circle around a screen point.
    const disturb = (clientX: number, clientY: number, radius: number, strength: number) => {
      const rect = canvas.getBoundingClientRect();
      const cx = Math.floor((clientX - rect.left) / CELL);
      const cy = Math.floor((clientY - rect.top) / CELL);
      for (let y = cy - radius; y <= cy + radius; y++) {
        for (let x = cx - radius; x <= cx + radius; x++) {
          const inside = x > 0 && x < w - 1 && y > 0 && y < h - 1;
          const inCircle = (x - cx) ** 2 + (y - cy) ** 2 <= radius * radius;
          if (inside && inCircle) current[y * w + x] += strength;
        }
      }
    };

    // Advances the simulation one frame, then swaps the two buffers.
    const step = () => {
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const neighbors = current[i - 1] + current[i + 1] + current[i - w] + current[i + w];
          previous[i] = (neighbors / 2 - previous[i]) * DAMPING;
        }
      }
      [current, previous] = [previous, current];
    };

    // Colors each cell by its depth plus the slope of the water around it.
    // The pixel array clamps to 0–255 on its own.
    const render = () => {
      const data = image.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          const interior = x > 0 && x < w - 1 && y > 0 && y < h - 1;
          const slope = interior
            ? current[i - 1] - current[i + 1] + (current[i - w] - current[i + w])
            : 0;
          const light = slope * SHADE;
          const p = i * 4;
          data[p] = rowColors[y * 3] + light;
          data[p + 1] = rowColors[y * 3 + 1] + light;
          data[p + 2] = rowColors[y * 3 + 2] + light;
          data[p + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    resize();
    render();

    const observer = new ResizeObserver(() => {
      resize();
      render();
    });
    observer.observe(canvas);

    // With reduced motion, stop at a still surface: no animation, no input.
    if (reduceMotion) return () => observer.disconnect();

    const onMove = (e: PointerEvent) => disturb(e.clientX, e.clientY, 1, MOVE_STRENGTH);
    const onDown = (e: PointerEvent) => disturb(e.clientX, e.clientY, 3, TAP_STRENGTH);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    let frame = 0;
    let lastDrop = 0;
    const tick = (time: number) => {
      if (time - lastDrop > AMBIENT_INTERVAL) {
        const rect = canvas.getBoundingClientRect();
        disturb(rect.left + Math.random() * rect.width, rect.top + Math.random() * rect.height, 2, AMBIENT_STRENGTH);
        lastDrop = time;
      }
      step();
      render();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}