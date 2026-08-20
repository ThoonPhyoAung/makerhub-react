import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Images, PlusCircle, Cpu } from "lucide-react";

// Original Bootstrap carousel-fade ကို bootstrap.bundle.js မပါဘဲ
// plain useState + setInterval နဲ့ ပြန်ဆောက်ထားတာပါ (auto-advance
// interval 4000ms ကို data-bs-interval="4000" အတိုင်းယူထားတယ်).
const slides = [
  {
    id: "featured-hardware",
    image: "/assets/Project.hub-Hero-Banner.jpg",
    badgeIcon: Cpu,
    badgeText: "Featured Hardware",
    title: "Arduino VENTUNO Q",
    lead: "Where AI takes action. Explore cutting-edge DIY projects powered by edge computing.",
    buttonText: "Explore Projects",
    buttonIcon: ArrowRight,
    // Same-page anchor — content section ဆီ scroll လုပ်တာမို့ <a> အတိုင်းထားရမယ်
    href: "#projectsSection",
  },
  {
    id: "community-showcase",
    image: "/assets/esp32-s31-banner.png",
    badgeIcon: null,
    badgeText: "Community Showcase",
    title: "ESP32-S31 Series",
    lead: "See what fellow makers are building with next-gen Wi-Fi & AI capabilities.",
    buttonText: "View Maker Projects",
    buttonIcon: Images,
    href: "#categoryNavBar",
  },
  {
    id: "learning-hub",
    image: "/assets/hero_img.png",
    badgeIcon: null,
    badgeText: "Arduino Learning Hub",
    title: "Build, Learn, Share",
    lead: "Join fellow developers in mastering embedded systems. Showcase your electronics and code.",
    buttonText: "Share Your Project",
    buttonIcon: PlusCircle,
    // Route link (Create Post page — နောက်မှ ဆောက်မယ်)
    to: "/community/create-post",
  },
];

function CommunityHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 my-4">
      <div className="relative rounded-3xl overflow-hidden shadow-sm h-[220px] md:h-[400px]">
        {slides.map((slide, i) => {
          const BadgeIcon = slide.badgeIcon;
          const ButtonIcon = slide.buttonIcon;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover brightness-[0.85]"
              />
              <div className="absolute inset-0 flex items-center">
                <div className="px-4 md:px-8 max-w-lg">
                  <span className="inline-flex items-center gap-1.5 bg-bg-elevated/90 text-text px-3 py-1.5 rounded-full text-xs font-bold mb-2 md:mb-3 shadow-sm">
                    {BadgeIcon && (
                      <BadgeIcon size={13} className="text-amber-400" />
                    )}
                    {slide.badgeText}
                  </span>
                  <h1 className="text-text font-black leading-tight mb-2 md:mb-3 text-[clamp(1.2rem,4vw,2.5rem)]">
                    {slide.title}
                  </h1>
                  <p className="hidden sm:block text-text-muted font-medium mb-3 md:mb-4">
                    {slide.lead}
                  </p>

                  {slide.to ? (
                    <Link
                      to={slide.to}
                      className="inline-flex items-center gap-1.5 bg-primary text-[#052010] font-bold text-sm md:text-base px-4 py-2 md:px-6 md:py-3 rounded-lg shadow hover:brightness-110 transition-all"
                    >
                      {slide.buttonText} <ButtonIcon size={16} />
                    </Link>
                  ) : (
                    <a
                      href={slide.href}
                      className="inline-flex items-center gap-1.5 bg-primary text-[#052010] font-bold text-sm md:text-base px-4 py-2 md:px-6 md:py-3 rounded-lg shadow hover:brightness-110 transition-all"
                    >
                      {slide.buttonText} <ButtonIcon size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-primary" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityHero;
