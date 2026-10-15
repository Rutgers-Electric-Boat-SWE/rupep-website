/**
 * Roster for the Meet the Team page.
 * The page renders whatever is in this file, so updating the team only means
 * editing this file. No component changes are needed.
 *
 * Headshots go in /public/team/. If a photo is missing or fails to load,
 * the card shows the person's initials instead.
 */

/** Intent color tokens from index.css (--purple, --blue, ...). */
export type Accent = "purple" | "blue" | "pink" | "mint" | "orange" | "yellow";

export interface TeamMember {
  name: string;
  role: string;
  /** Path relative to /public, e.g. "/team/president.jpg" */
  photo: string;
  /** Shown on the back of the card. Keep it to 1–2 short sentences so it fits in the circle. */
  funFact: string;
}

export interface TeamSection {
  id: string;
  title: string;
  accent: Accent;
  members: TeamMember[];
}

export const TEAM_SECTIONS: TeamSection[] = [
  {
    id: "eboard",
    title: "Executive Board",
    accent: "mint", // gold, to match the RU PEP title
    members: [
      { name: "First Last", role: "President", photo: "/team/president.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Vice President", photo: "/team/vp.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Treasurer", photo: "/team/treasurer.jpg", funFact: "Fun fact goes here." },
    ],
  },
  {
    id: "mechanical",
    title: "Mechanical Leads",
    accent: "orange",
    members: [
      { name: "First Last", role: "Mechanical Lead", photo: "/team/mech-1.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Mechanical Lead", photo: "/team/mech-2.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Mechanical Lead", photo: "/team/mech-3.jpg", funFact: "Fun fact goes here." },
    ],
  },
  {
    id: "electrical",
    title: "Electrical Leads",
    accent: "yellow",
    members: [
      { name: "First Last", role: "Electrical Lead", photo: "/team/elec-1.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Electrical Lead", photo: "/team/elec-2.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Electrical Lead", photo: "/team/elec-3.jpg", funFact: "Fun fact goes here." },
    ],
  },
  {
    id: "software",
    title: "Software Leads",
    accent: "purple",
    members: [
      { name: "First Last", role: "Software Lead", photo: "/team/sw-1.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Software Lead", photo: "/team/sw-2.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Software Lead", photo: "/team/sw-3.jpg", funFact: "Fun fact goes here." },
    ],
  },
  {
    id: "business",
    title: "Business Leads",
    accent: "pink",
    members: [
      { name: "First Last", role: "Business Lead", photo: "/team/biz-1.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Business Lead", photo: "/team/biz-2.jpg", funFact: "Fun fact goes here." },
      { name: "First Last", role: "Business Lead", photo: "/team/biz-3.jpg", funFact: "Fun fact goes here." },
    ],
  },
  {
    // TODO: rename once the sixth department's title is confirmed.
    id: "other",
    title: "Special Projects Lead",
    accent: "blue",
    members: [
      { name: "First Last", role: "Lead", photo: "/team/other-1.jpg", funFact: "Fun fact goes here." },
    ],
  },
];
