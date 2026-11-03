
import { useEffect, useState } from 'react'

export default function NewPage({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`mt-6 cursor-pointer rounded-full bg-brick-red-400 px-6 py-3 text-sm font-semibold text-steel-blue-950 transition hover:bg-brick-red-300 hover:scale-105 ${className}`}
      >
        Join Us
      </button>

      {isOpen && (
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
            <button
              type="button"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 cursor-pointer text-papaya-whip-200 hover:text-white"
            >
              X
            </button>

            <h2
              id="join-title"
              className="text-2xl font-bold text-papaya-whip-300"
            >
              RU PEP Meeting Times
            </h2>

            <p className="mt-3 text-papaya-whip-200">
              Meeting locations will vary. Join our Discord for more info.
            </p>

            <ul className="mt-4 space-y-4 text-sm text-white/80">
              <li>
                <span className="font-bold">
                  General Body Meeting: Mon 7-8pm (Biweekly)
                </span>
              </li>
              <li>Mechanical Subteam: Wed 6-7pm (Weekly)</li>
              <li>Software Subteam: Fri 6:30-7:30pm (Weekly)</li>
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
                Discord
              </a>

              <a
                href="https://www.instagram.com/rutgerselectricboat/"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on Instagram"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-papaya-whip-300/40 px-4 py-2 text-sm font-semibold text-papaya-whip-300 transition hover:bg-white/10 hover:scale-105"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
