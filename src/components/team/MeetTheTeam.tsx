import { motion } from "motion/react";
import type { Variants } from "motion/react";
import LifeRingCard from "./Liferingcard";
import WaterBackground from "./Waterbackground";
import BoatCursor from "./Boatcursor";
import { TEAM_SECTIONS } from "./team-data";
import type { Accent } from "./team-data";

// Sections whose members each have a distinct title (President, VP, ...).
// Everywhere else the section heading already names the role, so the pill is hidden.
const SECTIONS_WITH_ROLES = ["eboard"];

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
 * its own container. The water background sits outside that container, so it
 * stays fixed while the content scrolls.
 */
export default function MeetTheTeam() {
  return (
    // pointer-fine: hides the native cursor (on every element) only on mouse/trackpad
    // devices, where BoatCursor takes over. Touch screens are unaffected.
    <div className="relative h-full overflow-hidden bg-deep-space-blue-950 text-papaya-whip-50 pointer-fine:cursor-none pointer-fine:[&_*]:cursor-none">
      <BoatCursor />

      {/* Interactive water surface: ripples follow the pointer and taps */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <WaterBackground />
      </div>
      {/* Soft light from above, so the water looks lit from the surface */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(70% 45% at 50% 0%, rgba(102,201,255,0.18), transparent 70%)" }}
      />

      <main className="relative z-10 h-full overflow-y-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-(--s8) px-(--s4) py-(--s8)">
          <header className="flex flex-col items-center gap-(--s2) text-center">
            {/* Plain link back to the home view, since there's no router */}
            <a href="#" className="self-start text-sm text-papaya-whip-200 no-underline hover:text-papaya-whip-300">
              ← Home
            </a>
            <h1
              className="m-0 text-5xl font-bold tracking-[-0.03em] text-papaya-whip-300 md:text-6xl"
              style={{ filter: "drop-shadow(0 6px 18px rgba(0, 0, 0, 0.45))" }}
            >
              Meet the Team
            </h1>
            <p className="m-0 text-sm font-medium tracking-wide sm:text-base">
              <span className="text-brick-red-300">The crew behind RU PEP.</span>{" "}
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
                    <LifeRingCard
                      member={member}
                      accent={section.accent}
                      showRole={SECTIONS_WITH_ROLES.includes(section.id)}
                    />
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