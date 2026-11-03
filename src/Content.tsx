
import { IconBrandDiscord, IconBrandInstagram } from "@tabler/icons-react";
import { useState } from "react";
import { ParticleField } from "./components/ui/particle-field";
import NewPage from "./NewPage";
import StatsSection from "./components/StatsSection";

function Content() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <ParticleField
          count={1200}
          speed={0.25}
          size={0.04}
          theme="auto"
          className="h-full w-full"
        />
      </div>

      <nav className="relative z-10 pt-14">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/RU_PEP_Logo.png"
              alt="img_logo"
              className="h-20 w-auto object-contain"
            />
            <p className="text-6xl font-bold md:text-4xl sm:text-3xl">
              Rutgers Electric Boat
            </p>
          </div>

          <ul className="hidden md:flex items-center gap-4" id="nav_socials">
            <li>
              <a
                href="https://www.instagram.com/rutgerselectricboat/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandInstagram size={50} />
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/XemahGHfE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandDiscord size={50} />
              </a>
            </li>
          </ul>
        </div>

        <button
          className="md:hidden p-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          Socials
        </button>

        {isMenuOpen && (
          <div className="md:hidden px-4 py-4 bg-slate-900 border-t border-slate-800 shadow-xl">
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="https://www.instagram.com/rutgerselectricboat/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandInstagram size={25} />
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/XemahGHfE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandDiscord size={25} />
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Image */}
      <div className="relative z-10 w-full overflow-hidden rounded-3xl p-3">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="/pep-1.jpg"
            alt="img_main"
            className="block w-full h-75 sm:h-86 md:h-150 object-cover object-bottom rounded-3xl"
          />

          {/* Hero Overlay */}
          <div className="absolute inset-0 rounded-3xl bg-slate-600/70 flex flex-col items-center justify-center p-6 text-center text-white">
            <h1 className="text-4xl sm:text-6xl md:text-5xl font-bold tracking-tighter mb-4 max-w-4xl">
              Explore or Connect with our Award Winning Team
            </h1>

            <p className="text-lg sm:text-xl font-normal text-papaya-whip-300 max-w-2xl">
              Rutger Electric Boat
              <br />
              Founded 2025
            </p>

            {/* Join Us Button - Centered Under Founded 2024 */}
            <div className="flex w-full justify-center mt-6">
              <NewPage />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
