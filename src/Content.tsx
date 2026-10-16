import { IconBrandDiscord, IconBrandInstagram } from "@tabler/icons-react";
import {useState} from "react";
import { ParticleField } from "./components/ui/particle-field";

function Content() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return(    
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
    <nav className="relative z-10">
        <div className = "flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-3">
          <img src="/RU_PEP_Logo.png" alt="img_logo" className="h-20 w-auto object-contain"/>
          <p className="text-6xl font-bold md:text-4xl sm:text-3xl">Rutgers Electric Boat</p>
          </div>
        <ul className = "hidden md:flex items-center gap-4" id="nav_socials">
        <li><a href = "#" target="_blank" rel="noopener noreferrer"><IconBrandInstagram size={50}></IconBrandInstagram></a></li>
        <li><a href = "https://discord.gg/XemahGHfE" target="_blank" rel="noopener noreferrer"><IconBrandDiscord size={50}></IconBrandDiscord></a></li>
      </ul>
      </div>
        <button className = "md:hidden p-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
  
          Socials
          </button>
        {isMenuOpen &&(
      <div className="md:hidden px-4 py-4 bg-slate-900 border-t border-slate-800 shadow-xl">
        <ul className="flex items-center gap-6">
          <li><a href = "#" target="_blank" rel="noopener noreferrer"><IconBrandInstagram size={25}></IconBrandInstagram></a></li>
        <li><a href = "https://discord.gg/XemahGHfE" target="_blank" rel="noopener noreferrer"><IconBrandDiscord size={25}></IconBrandDiscord></a></li>
        </ul>
      </div>
        )}
    </nav>
    <div className = "relative z-10 w-full overflow-hidden p-3">
        <img src = "/pep-1.jpg" alt = "img_main" className="w-full h-75 sm:h-86 md:h-150 block object-cover object-bottom"></img>
        <div className="absolute inset-3 bg-slate-600/70 flex flex-col items-center justify-center p-6 text-center text-white">
        <h1 className="text-4xl sm:text-6xl md:text-5xl font-bold tracking-tighter mb-4 max-w-4xl">
          Explore or Connect with our Award Winning Team  
        </h1>
        <p className="text-lg sm:text-xl font-normal flex items-center justify-center text-papaya-whip-300 max-w-2xl">
          Rutger Electric Boat
          <br/>Founded 2024</p>
        </div>
    </div>
    </div>
    );}

    export default Content;