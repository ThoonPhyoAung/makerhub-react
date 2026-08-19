import { Cpu, Heart } from "lucide-react";

// Lucide v1+ က Brand/Logo Icon တွေ (Github, Youtube...) ကို ဖြုတ်လိုက်လို့
// ကိုယ်တိုင် Small SVG Icon အနေနဲ့ ဆောက်ထားတာပါ — Library Version ပြောင်းလည်း မထိခိုက်ဘူး
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
  </svg>
);
const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
  </svg>
);
const DiscordIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.3 5.4A18 18 0 0 0 15.9 4l-.3.6a13 13 0 0 1 3.7 1.4 15 15 0 0 0-15 0 13 13 0 0 1 3.7-1.4L7.7 4a18 18 0 0 0-4.4 1.4C.9 9.6.3 13.6.6 17.6a18 18 0 0 0 5.4 2.7l.9-1.4a12 12 0 0 1-1.9-.9l.5-.4c3.6 1.7 7.5 1.7 11 0l.5.4a12 12 0 0 1-1.9.9l.9 1.4a18 18 0 0 0 5.4-2.7c.4-4.6-.8-8.6-3.1-12.2ZM8.5 15c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm7 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
  </svg>
);

function Footer() {
  const columns = [
    {
      heading: "Platform",
      links: ["Arduino", "ESP32", "Raspberry Pi", "All Tutorials"],
    },
    {
      heading: "Community",
      links: ["Discussions", "Project Showcase", "Events"],
    },
    {
      heading: "Marketplace",
      links: ["All Products", "Sensors", "Motors"],
    },
    {
      heading: "Company",
      links: ["About Us", "Contact", "Privacy Policy"],
    },
  ];

  const socials = [GithubIcon, InstagramIcon, YoutubeIcon, DiscordIcon];

  return (
    <footer className="pt-16 pb-6 bg-bg border-t border-border-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-10 mb-12">
          {/* Brand column — Mobile: full width (span 2), Desktop: 2/6 width */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 text-text font-extrabold text-xl mb-3">
              <Cpu size={22} className="text-primary" />
              MakerHub MM
            </div>
            <p className="text-text-muted text-sm max-w-xs">
              Empowering Myanmar makers, students, and innovators through IoT
              education and community.
            </p>
          </div>

          {/* Link columns — Mobile: 2 per row (grid-cols-2 parent), Desktop: 1/6 each in same row as brand */}
          {columns.map((col, i) => (
            <div
              key={col.heading}
              className={i === columns.length - 1 ? "lg:text-right" : ""}
            >
              <h6 className="text-text font-bold text-sm uppercase tracking-wider mb-5">
                {col.heading}
              </h6>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-text-muted text-sm hover:text-primary hover:translate-x-1 inline-block transition-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-border-muted mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-text-subtle hover:text-text transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-text-muted text-sm">
            Made with <Heart size={14} className="text-red-500 fill-red-500" />{" "}
            in Myanmar
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
