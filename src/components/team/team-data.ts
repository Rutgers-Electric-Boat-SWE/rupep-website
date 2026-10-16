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
  photoPosition?: string; // optional: "x% y%" to aim the crop, default "50% 25%"
  photoZoom?: number;     // optional: 1 = normal, 1.5 = zoom in 50%
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
      { name: "Matthew Mohammed", role: "President", photo: "/team/photos/e-board president.png", funFact: "I play electric guitar and I like to go biking."},
      { name: "Jared Singer", role: "Vice President", photo: "/team/photos/e-board vp.png", funFact: "I like hiking and metal music."},
      { name: "Shubham Sharma", role: "Treasurer", photo: "/team/photos/e-board treasurer.png", funFact: "I swim."},
    ],
  },
  {
    id: "mechanical",
    title: "Mechanical Leads",
    accent: "orange",
    members: [
      { name: "Praneil Mukkamala", role: "Mechanical Lead", photo: "/team/photos/mechi lead.png", funFact: "Rock climbing is my favorite hobby!"},
      { name: "Saarthak Shah", role: "Mechanical Lead", photo: "/team/mech-2.jpg", funFact: "I am going to graduate with 4 degrees (kinda)."},
      { name: "Patrick Brennan", role: "Mechanical Lead", photo: "/team/photos/mechi leads.png", funFact: "I’m the one on the left"},
    ],
  },
  {
    id: "electrical",
    title: "Electrical Leads",
    accent: "yellow",
    members: [
      { name: "Krish Patel", role: "Electrical Lead", photo: "/team/photos/e lead.png", funFact: "I have used a CNC machine."},
      { name: "Andy Heath", role: "Electrical Lead", photo:"/team/photos/electrical leads 2.png", funFact: "I’m a twin."},
      { name: "Praneeth Damarla", role: "Electrical Lead", photo: "/team/photos/electrical leads3.png", funFact: "I collect Pokemon cards."},
    ],
  },
  {
    id: "software",
    title: "Software Leads",
    accent: "purple",
    members: [
      { name: "Deepti Rao", role: "Software Lead", photo: "/team/photos/software l1.png", funFact: "I cannot swim but I can doggy paddle."},
      { name: "Shoubhit Mukherjee", role: "Software Lead", photo: "/team/photos/softwarel2.png", funFact: "I 3D printed the custom chair stand because I hated the noise the dorm chairs make when you lean back on them."},
      { name: "Srinithin Ganesh", role: "Software Lead", photo: "/team/photos/s3.png", funFact: "I’m left handed."},
    ],
  },
  {
    id: "business",
    title: "Business Leads",
    accent: "pink",
    members: [
      { name: "Shalini Patel", role: "Business Lead", photo: "/team/photos/bus1.png", funFact: "I have been on 14 Disney Cruises :)"},
      { name: "Hannah Breunig", role: "Business Lead + Social Media", photo: "/team/photos/b2.png", funFact: "I have been to Bucee’s 6 times."},
      { name: "Ananya Jaising", role: "Business Lead", photo: "/team/photos/b3.png", funFact: "I studied abroad in London last semester."},
      { name: "Praneeta Kondragunta", role: "EGC Representative", photo: "/team/photos/b4.png", funFact: "I teach pilates at the Rutgers Rec!."},
    ],
  },
  
];