import { motion } from "motion/react";

import { WorksWheel, type WorksWheelItem } from "./components/WorksWheel";
import ImageRipple from "./components/ImageRipple";
import { Button } from "./components/pouf/Button";
import { ParticleField } from "./components/ui/particle-field";

/* ---------------------------------------------------------
   RU PEP palette -> shadcn variables (used by the particles)
   Red + gold. Set on <html> before first render so the
   theme hook sees them.
   --------------------------------------------------------- */
const PEP_THEME: Record<string, string> = {
  "--background": "#0b1319", // steel-blue-950
  "--foreground": "#f8ca6d", // gold
  "--primary": "#ee4450", // brick-red-400
  "--primary-foreground": "#0b1319",
  "--secondary": "#f8ca6d", // papaya-whip-300 (gold)
  "--secondary-foreground": "#0b1319",
  "--accent": "#f6b83c", // papaya-whip-400 (deeper gold)
  "--accent-foreground": "#0b1319",
  "--muted": "#101c23",
  "--muted-foreground": "#f2737b", // brick-red-300
  "--chart-1": "#ee4450", // red
  "--chart-2": "#f8ca6d", // gold
  "--chart-3": "#e91624", // strong red
  "--chart-4": "#f6b83c", // gold
  "--chart-5": "#f2737b", // soft red
};

if (typeof document !== "undefined") {
  const root = document.documentElement;
  root.classList.add("dark");
  for (const [key, value] of Object.entries(PEP_THEME)) {
    root.style.setProperty(key, value);
  }
}

const WORKS: WorksWheelItem[] = [
  {
    title: "PEP 01",
    image: "/pep-1.jpg",
    href: "#pep-1",
  },
  {
    title: "PEP 02",
    image: "/pep-2.jpg",
    href: "#pep-2",
  },
  {
    title: "PEP 03",
    image: "/pep-3.jpg",
    href: "#pep-3",
  },
  {
    title: "PEP 04",
    image: "/pep-4.jpg",
    href: "#pep-4",
  },
  {
    title: "PEP 05",
    image: "/pep-5.jpg",
    href: "#pep-5",
  },
];

function CenterContent() {
  return (
    <div className="pointer-events-none flex flex-col items-center justify-center text-center">
      {/* Ripple Logo */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
          scale: 0.85,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-[110px] sm:w-[130px]"
      >
        <ImageRipple />
      </motion.div>

      {/* Text + button group (shifted up) */}
      <div className="flex -translate-y-5 flex-col items-center">
        {/* Title */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="-mt-10 text-4xl font-bold leading-[0.95] tracking-[-0.03em] text-papaya-whip-300 sm:text-5xl"
          style={{
            filter:
              "drop-shadow(0 6px 18px rgba(248, 202, 109, 0.3))",
          }}
        >
          RU PEP
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.7,
          }}
          className="mt-2 text-xs font-medium tracking-wide sm:text-sm"
        >
          <span className="text-brick-red-300">Rutgers</span>{" "}
          <span className="text-papaya-whip-200">
            Award Winning Electric Boat Team
          </span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 0.9,
          }}
          transition={{
            delay: 0.5,
            duration: 0.7,
            type: "spring",
            stiffness: 250,
            damping: 18,
          }}
          className="pointer-events-auto mt-4"
        >
          <motion.div
            whileHover={{
              y: -5,
              scale: 1.04,
            }}
            whileTap={{
              y: 2,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
            }}
            className="rounded-full"
          >
            <Button>
              <span className="flex items-center gap-2 px-3">
                <span>Get Started</span>

                <motion.span
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-steel-blue-950 text-white">
      {/* Soft blue glow behind everything */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(0,166,255,0.12), transparent 70%)",
        }}
      />

      {/* Particle background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <ParticleField
          count={1200}
          speed={0.25}
          size={0.04}
          theme="auto"
          className="h-full w-full"
        />
      </div>

      {/* Wheel sits on top */}
      <div className="relative z-10">
        <WorksWheel
          items={WORKS}
          label="RU PEP"
          center={<CenterContent />}
        />
      </div>
    </main>
  );
}

export default App;