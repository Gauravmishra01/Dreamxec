import { Header } from '../Header'
import { Footer } from '../Footer'

interface ComingSoonProps {
  title: string
  subtitle?: string
}

const ComingSoon = ({ title, subtitle }: ComingSoonProps) => {
  return (
    <>
      <title>{title} | DreamXec</title>
      <meta
        name="description"
        content={`${title} page is coming soon. Stay tuned for exciting updates from DreamXec.`}
      />

      <Header />

      <main
        className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden"
        style={{ background: '#fffbf5' }}
      >

        {/* ── Background decorations ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, #003366 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Corner squares */}
          <div className="absolute top-10 left-8 w-16 h-16 rotate-12 opacity-10" style={{ background: '#FF7F00', border: '3px solid #003366' }} />
          <div className="absolute top-20 left-20 w-8 h-8 rotate-45 opacity-10" style={{ border: '2px solid #0B9C2C' }} />
          <div className="absolute top-12 right-10 w-12 h-12 -rotate-6 opacity-10" style={{ background: '#0B9C2C', border: '3px solid #003366' }} />
          <div className="absolute top-28 right-24 w-5 h-5 rotate-45 opacity-10" style={{ border: '2px solid #FF7F00' }} />
          <div className="absolute bottom-20 left-10 w-14 h-14 -rotate-12 opacity-10" style={{ border: '3px solid #003366' }} />
          <div className="absolute bottom-12 right-12 w-10 h-10 rotate-6 opacity-10" style={{ background: '#003366' }} />

          {/* Tricolor vertical bars */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-40 flex flex-col hidden sm:flex">
            <div className="flex-1" style={{ background: '#FF7F00', opacity: 0.3 }} />
            <div className="flex-1" style={{ background: '#003366', opacity: 0.3 }} />
            <div className="flex-1" style={{ background: '#0B9C2C', opacity: 0.3 }} />
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-40 flex flex-col hidden sm:flex">
            <div className="flex-1" style={{ background: '#0B9C2C', opacity: 0.3 }} />
            <div className="flex-1" style={{ background: '#003366', opacity: 0.3 }} />
            <div className="flex-1" style={{ background: '#FF7F00', opacity: 0.3 }} />
          </div>
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-8">

          {/* Eyebrow badge */}
          <div className="flex items-center gap-0">
            <div className="w-3 h-3" style={{ background: '#FF7F00' }} />
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-white"
              style={{ background: '#003366', border: '2px solid #003366' }}>
              🚧 DreamXec
            </div>
            <div className="w-3 h-3" style={{ background: '#0B9C2C' }} />
          </div>

          {/* Illustration */}
          <div className="relative">
            {/* Shadow block behind illustration */}
            <div className="absolute inset-0 translate-x-[8px] translate-y-[8px]" style={{ background: '#FF7F00' }} aria-hidden />
            <div
              className="relative w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center bg-white"
              style={{ border: '4px solid #003366' }}
            >
              <img
                src="/assets/icon-pack/DX-ILLUSTRATION-PACK/15.svg"
                alt="Coming Soon"
                className="w-3/4 h-3/4 object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 translate-x-[6px] translate-y-[6px]" style={{ background: '#0B9C2C' }} aria-hidden />
              <h1
                className="relative z-10 inline-block px-5 py-2 font-black text-white uppercase tracking-tight leading-none"
                style={{ fontSize: 'clamp(1.5rem,5vw,3rem)', background: '#FF7F00', border: '4px solid #003366' }}
              >
                {title}
              </h1>
            </div>

            {subtitle && (
              <p className="font-bold text-base sm:text-lg text-[#003366]/70 mt-3">{subtitle}</p>
            )}
          </div>

          {/* Main card */}
          <div
            className="w-full bg-white p-7 sm:p-10"
            style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}
          >
            {/* Top tricolor strip */}
            <div className="flex h-1.5 -mx-7 sm:-mx-10 -mt-7 sm:-mt-10 mb-8">
              <div className="flex-1" style={{ background: '#FF7F00' }} />
              <div className="flex-1" style={{ background: '#003366' }} />
              <div className="flex-1" style={{ background: '#0B9C2C' }} />
            </div>

            <div className="flex flex-col items-center gap-5 text-center">
              {/* "Coming Soon" pill */}
              <div
                className="px-5 py-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#003366]"
                style={{ background: '#FF7F00', border: '3px solid #003366', boxShadow: '4px 4px 0 #003366' }}
              >
                🚀 Coming Soon
              </div>

              <p className="text-sm sm:text-base font-bold text-[#003366] leading-relaxed">
                We're building something exciting.{' '}
                <span className="font-black">Stay tuned!</span>
              </p>

              <p
                className="text-xs sm:text-sm font-bold text-[#003366]/60 leading-relaxed text-justify max-w-sm mx-auto"
                style={{ borderLeft: '3px solid #FF7F00', paddingLeft: '12px' }}
              >
                This page will be available soon with amazing content to help you on your innovation journey with DreamXec.
              </p>
            </div>
          </div>

          {/* CTA section */}
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#003366]/50">
              In the meantime, explore:
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Home', href: '/', bg: '#003366', shadow: '#FF7F00' },
                { label: 'Browse Campaigns', href: '/campaigns', bg: '#FF7F00', shadow: '#003366', textColor: '#003366' },
                { label: 'Contact Us', href: '/contact', bg: '#0B9C2C', shadow: '#003366' },
              ].map(({ label, href, bg, shadow, textColor }) => (
                <a
                  key={label}
                  href={href}
                  className="px-6 py-3 font-black text-xs uppercase tracking-widest transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{
                    background: bg,
                    color: textColor ?? '#fff',
                    border: '3px solid #003366',
                    boxShadow: `4px 4px 0 ${shadow}`,
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default ComingSoon