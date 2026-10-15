import { motion } from "motion/react";
import type { Variants } from "motion/react";
import PortholeCard from "./PortholeCard";
import { TEAM_SECTIONS } from "./team-data";
import type { Accent } from "./team-data";
import { ParticleField } from "../ui/particle-field";

// Each card fades and rises in, one after another, as its section scrolls into view.
const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

/**
 * Meet the Team page for RU PEP. It's shown when the URL hash is #team (see App.tsx).
 * The roster comes from ./team-data.ts.
 *
 * index.css sets `overflow: hidden` on html and body, so this page scrolls inside
 * its own container. The particle background sits outside that container, so it
 * stays fixed while the content scrolls.
 */
export default function MeetTheTeam() {
  return (
    <div className="relative h-full overflow-hidden bg-steel-blue-950 text-papaya-whip-50">
      {/* Same backdrop as the home page: soft blue glow + particles */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(60% 50% at 50% 30%, rgba(0,166,255,0.12), transparent 70%)" }}
      />
      <div className="pointer-events-none absolute inset-0 z-0">
        <ParticleField count={600} speed={0.25} size={0.04} theme="auto" className="h-full w-full" />
      </div>

      <main className="relative z-10 h-full overflow-y-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-(--s8) px-(--s4) py-(--s8)">
          <header className="flex flex-col items-center gap-(--s2) text-center">
            {/* Plain link back to the home view, since there's no router */}
            <a href="#" className="self-start text-sm text-papaya-whip-200 no-underline hover:text-papaya-whip-300">
              ← Home
            </a>
            <h1
              className="m-0 text-5xl font-bold tracking-[-0.03em] text-papaya-whip-300 md:text-6xl"
              style={{ filter: "drop-shadow(0 6px 18px rgba(248, 202, 109, 0.3))" }}
            >
              Meet the Team
            </h1>
            <p className="m-0 text-sm font-medium tracking-wide sm:text-base">
              <span className="text-brick-red-300">The crew behind RU PEP.</span>{" "}
              <span className="text-papaya-whip-200">Hover or tap a porthole for a fun fact.</span>
            </p>
          </header>

          {TEAM_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={`${section.id}-title`} className="flex flex-col gap-(--s6)">
              <SectionHeading id={`${section.id}-title`} title={section.title} accent={section.accent} />

              {/* flex-wrap + justify-center keeps a single-member section centered
                  and wraps three cards cleanly on narrow screens */}
              <motion.ul
                className="m-0 flex list-none flex-wrap justify-center gap-(--s8) p-0"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {section.members.map((member) => (
                  <motion.li key={`${section.id}-${member.name}-${member.role}`} variants={cardVariants}>
                    <PortholeCard member={member} accent={section.accent} />
                  </motion.li>
                ))}
              </motion.ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

/** Pill-shaped section label with a fading rule on either side. */
function SectionHeading({ id, title, accent }: { id: string; title: string; accent: Accent }) {
  return (
    <div className="flex items-center gap-(--s4)">
      <span className="h-[3px] flex-1 rounded-full bg-gradient-to-r from-transparent to-papaya-whip-300 opacity-30" />
      <h2
        id={id}
        className="m-0 rounded-full px-(--s6) py-(--s2) text-xl text-(--on-accent) md:text-2xl"
        style={{
          backgroundColor: `var(--${accent})`,
          boxShadow: "inset 0 2px 1px rgba(255,255,255,0.35), 0 var(--lip-row) 0 rgba(0,0,0,0.3)",
        }}
      >
        {title}
      </h2>
      <span className="h-[3px] flex-1 rounded-full bg-gradient-to-l from-transparent to-papaya-whip-300 opacity-30" />
    </div>
  );
}