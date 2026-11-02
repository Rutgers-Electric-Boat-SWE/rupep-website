import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function NewPage() {
  const [isOpen, setIsOpen] = useState(false)

  // Closing the popup for Join Us 
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <main className="relative min-h-screen bg-steel-blue-950 text-white"> 
      <header className="flex items-center justify-between px-6 py-4"> 
        <Link to="/" className="text-xl font-bold text-papaya-whip-300">
          RU PEP
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded-full bg-brick-red-400 px-5 py-2 text-sm font-semibold text-steel-blue-950 transition hover:bg-brick-red-300 hover:scale-105"
        >
          Join Us
        </button>
      </header> 

      <section className="px-6 py-16 text-center"> 
        <h1 className="text-4xl font-bold text-papaya-whip-300">
          Yadadadiya
        </h1>
        <p className="mt-4 text-papaya-whip-200">
          Blah blah
        </p>
      </section>

      {isOpen && ( //Popup
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-title"
            className="relative w-full max-w-md rounded-2xl border border-papaya-whip-300/20 bg-steel-blue-900 p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button //Popup X button
              type="button"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 cursor-pointer text-papaya-whip-200 hover:text-white"
            >
              X
            </button>

            <h2
              id="join-title"
              className="text-2xl font-bold text-papaya-whip-300" //Popup information
            >
              RU PEP Meeting Times
            </h2>
            <p className="mt-3 text-papaya-whip-200">
              Meeting locations will vary. Join our Discord for more info.
            </p>
            <ul className="mt-4 space-y-4 text-sm text-white/80">
              <li> <span className="text-bold">General Body Meeting: Mon 7-8pm (Biweekly)</span>  </li>
              <li>Mechanical Subteam: Wed 6-7pm (Weekly) </li>
              <li>Software Subteam: Fri 6:30-7:30pm (Weekly) </li>
              <li>Electrical Subteam: Thu 7-8pm (Weekly)</li>
              <li>Business Subteam: Sun 2pm (Weekly)</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href="https://discord.gg/5mHDjMqrKN"
                target="_blank"
                rel="noreferrer"
                aria-label="Join our Discord"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brick-red-400 px-4 py-2 text-sm font-semibold text-steel-blue-950 transition hover:scale-105 hover:bg-brick-red-300"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
                Discord
              </a>

              <a
                href="https://www.instagram.com/rutgerselectricboat/"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on Instagram"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-papaya-whip-300/40 px-4 py-2 text-sm font-semibold text-papaya-whip-300 transition hover:bg-white/10 hover:scale-105"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}