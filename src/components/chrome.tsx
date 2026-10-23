import { site, siteLink } from "@/lib/site";

/*
 * Header, footer, and staff divider, matching the main site's components
 * (src/components/ui.tsx over there). Keep the markup and class names in
 * step so the shared styles in globals.css keep lining up.
 */

/** Five hairlines, like an empty musical staff. Used as a section break. */
export function Staff({ label }: { label?: string }) {
  return (
    <div className="staff" role="separator">
      <div className="staff-lines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      {label && <span className="staff-label">{label}</span>}
    </div>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <a href={siteLink("/")} className="wordmark">
        {site.name}
      </a>
      <nav aria-label="Main">
        {site.nav.map((item) => (
          <a
            key={item.path}
            href={siteLink(item.path)}
            aria-current={item.path === "/projects/" ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {site.name} ·{" "}
        <a href={site.source}>Source</a>
      </span>
      <span className="footer-links">
        {site.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </span>
    </footer>
  );
}
