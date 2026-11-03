
"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";

function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest)
  );

  const isInView = useInView(ref, {
    once: true,
    amount: 0.6,
  });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [isInView, value, count]);

  return (
    <span className="inline-flex items-baseline">
      <motion.span ref={ref}>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 3,
    suffix: "rd",
    label: "Nationally Ranked",
    description: "Our team's latest national competition finish.",
  },
  {
    value: 40,
    suffix: "+",
    label: "Teams Competed",
    description: "Competing against teams from across the country.",
  },
  {
    value: 7,
    suffix: "th",
    label: "Previous Finish",
    description: "Our earlier national competition placement.",
  },
];

const milestones = [
  {
    date: "MAY 2025",
    title: "Where It Started",
    description:
      "Rutgers Electric Boat was founded with a mission to design, build, and compete.",
  },
  {
    date: "FALL 2026",
    title: "Officially Chartered",
    description:
      "Officially chartered by Rutgers University, marking a new chapter for the team.",
  },
];

const reveal = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-steel-blue-950 px-6 py-28 text-white sm:px-10">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(238,68,80,0.10), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-brick-red-300">
            The Numbers Speak
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-papaya-whip-300 sm:text-6xl">
            Built to Compete.
            <br />
            Driven to Win.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-papaya-whip-200/70 sm:text-lg">
            From our first competition to earning a place among
            the nation's top teams, we're building something
            worth racing for.
          </p>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -8,
                borderColor: "rgba(238,68,80,0.65)",
              }}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-9 text-center backdrop-blur-sm transition-colors hover:bg-white/[0.07]"
            >
              <div className="mb-4 text-6xl font-bold tracking-tighter text-papaya-whip-300 sm:text-7xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                />
              </div>

              <h3 className="text-lg font-bold text-white">
                {stat.label}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-papaya-whip-200/60">
                {stat.description}
              </p>

              <div className="mx-auto mt-7 h-1 w-10 rounded-full bg-brick-red-400 transition-all duration-500 group-hover:w-20" />
            </motion.div>
          ))}
        </div>

        {/* Timeline heading */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mb-14 mt-32 text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-brick-red-300">
            Our Journey
          </p>

          <h2 className="text-4xl font-bold text-papaya-whip-300 sm:text-5xl">
            From an Idea to a Team.
          </h2>
        </motion.div>

        {/* Milestones */}
        <div className="relative mx-auto max-w-3xl">
          {/* Timeline line */}
          <div className="absolute bottom-0 left-[9px] top-0 w-px bg-white/15 sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.date}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                }}
                className={`relative flex pl-10 sm:w-1/2 sm:pl-0 ${
                  index % 2 === 0
                    ? "sm:mr-auto sm:pr-12 sm:text-right"
                    : "sm:ml-auto sm:pl-12 sm:text-left"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 z-10 h-[19px] w-[19px] rounded-full border-4 border-steel-blue-950 bg-brick-red-400 shadow-[0_0_20px_rgba(238,68,80,0.5)] sm:left-auto sm:right-[-9px]">
                  {index % 2 !== 0 && (
                    <span className="hidden" />
                  )}
                </div>

                {index % 2 !== 0 && (
                  <div className="hidden sm:block absolute left-[-9px] top-2 z-10 h-[19px] w-[19px] rounded-full border-4 border-steel-blue-950 bg-brick-red-400 shadow-[0_0_20px_rgba(238,68,80,0.5)]" />
                )}

                <div>
                  <p className="mb-2 text-xs font-bold tracking-[0.25em] text-brick-red-300">
                    {milestone.date}
                  </p>

                  <h3 className="text-2xl font-bold text-papaya-whip-300">
                    {milestone.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-papaya-whip-200/60">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
