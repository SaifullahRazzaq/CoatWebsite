import { NAV_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="relative border-t border-bone/10 bg-pitch">
      <div className="mx-auto max-w-[1560px] px-6 py-16 md:px-10 lg:px-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-[1.75rem] text-bone">Aldermay</p>
            <p className="mt-4 max-w-xs text-[13px] font-light leading-relaxed text-mute">
              Bespoke tailors. 14 Sackville Street, London W1S 3DP.
              Established 1908.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-4">
            <p className="eyebrow mb-6 text-[9px]">Explore</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[12px] uppercase tracking-[0.18em] text-bone-dim transition-colors duration-500 hover:text-champagne"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-6 text-[9px]">Workroom hours</p>
            <p className="text-[12px] font-light leading-relaxed text-bone-dim">
              Tuesday — Saturday
              <br />
              09:30 — 18:00
            </p>

            <p className="eyebrow mb-6 mt-10 text-[9px]">Elsewhere</p>
            <ul className="space-y-3">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "WhatsApp", href: "https://wa.me/442075550108" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[12px] uppercase tracking-[0.18em] text-bone-dim transition-colors duration-500 hover:text-champagne"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bone/10 pt-8 text-[10px] uppercase tracking-[0.2em] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Aldermay Tailors</p>
          <p>Cut, canvassed and finished by hand</p>
        </div>
      </div>
    </footer>
  );
}
