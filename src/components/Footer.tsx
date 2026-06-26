import Link from "next/link";

interface FooterProps {
  stripItems?: string[];
  bottomLeft?: string;
  bottomRight?: string;
  navColumns?: Array<{
    label: string;
    links: Array<{ text: string; href: string }>;
  }>;
  simpleNavLinks?: Array<{ text: string; href: string }>;
}

export default function Footer({
  stripItems = [
    "INDUCTION 2026",
    "CLASS OF 2028",
    "IIIT DELHI",
    "A NEW FILE HAS BEEN OPENED",
  ],
  bottomLeft = "INDUCTION 2026 — IIIT DELHI",
  bottomRight,
  navColumns,
  simpleNavLinks,
}: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-top-strip">
        {stripItems.map((item, i) => (
          <span key={i}>
            {item}
            {i < stripItems.length - 1 && <span className="mq-sep">✦</span>}
          </span>
        ))}
      </div>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-name">
            INDRAPRASTHA INSTITUTE OF
            <br />
            INFORMATION TECHNOLOGY, DELHI
          </div>
        </div>
        {navColumns ? (
          <nav className="footer-nav">
            {navColumns.map((col, ci) => (
              <div className="footer-col" key={ci}>
                <span className="footer-col-label">{col.label}</span>
                {col.links.map((link, li) => (
                  <Link key={li} href={link.href}>
                    {link.text}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        ) : simpleNavLinks ? (
          <nav className="footer-nav">
            {simpleNavLinks.map((link, i) => (
              <Link key={i} href={link.href}>
                {link.text}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      <div className="footer-bottom">
        <span>{bottomLeft}</span>
        {bottomRight && <span>{bottomRight}</span>}
        {!bottomRight && (
          <span>
            Developed & Designed with ❤️ by{" "}
            <a
              href="https://linkedin.com/in/mukulyadav525"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mukul Yadav
            </a>
            ,{" "}
            <a
              href="https://linkedin.com/in/vasumehta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vasu Mehta
            </a>{" "}
            and{" "}
            <a
              href="https://linkedin.com/in/yuvrajj-singhh"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yuvraj Singh
            </a>
          </span>
        )}
      </div>
    </footer>
  );
}
