import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Images, PlusCircle, Cpu } from "lucide-react";

const slides = [
  {
    id: "featured-hardware",
    image: "/assets/Project.hub-Hero-Banner.jpg",
    badgeIcon: <Cpu className="w-3 h-3 text-amber-400" />,
    badgeText: "Featured Hardware",
    badgeClass: "bg-black/80 text-white",
    title: "Arduino VENTUNO Q",
    lead: "Where AI takes action. Explore cutting-edge DIY projects powered by edge computing.",
    buttonText: "Explore Projects",
    buttonIcon: <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />,
    href: "#projectsSection",
  },
  {
    id: "community-showcase",
    image: "/assets/esp32-s31-banner.png",
    badgeText: "Community Showcase",
    badgeClass: "bg-[#0d6efd] text-white",
    title: "ESP32-S31 Series",
    lead: "See what fellow makers are building with next-gen Wi-Fi & AI capabilities.",
    buttonText: "View Maker Projects",
    buttonIcon: <Images className="w-3.5 h-3.5 md:w-4 md:h-4" />,
    href: "#categoryNavBar",
  },
  {
    id: "learning-hub",
    image: "/assets/hero_img.png",
    badgeText: "Arduino Learning Hub",
    badgeClass: "bg-primary text-white",
    title: "Build, Learn, Share",
    lead: "Join fellow developers in mastering embedded systems. Showcase your electronics and code.",
    buttonText: "Share Your Project",
    buttonIcon: <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />,
    to: "/create-post",
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
      {/* Mobile Height ကို h-[180px] သို့ တိုးပြီး Desktop ကို h-[350px] ထားထားသည် */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm h-[180px] sm:h-[220px] md:h-[350px]">
        {slides.map((slide, i) => {
          const isCurrent = i === current;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isCurrent
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover brightness-[0.75]"
              />
              <div className="absolute inset-0 flex items-center">
                <div className="px-4 md:px-8 max-w-lg">
                  {/* Badge: Mobile စခရင်အတွက် text size နဲ့ padding လျှော့ထားသည် */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold mb-1.5 md:mb-3 shadow-sm ${slide.badgeClass}`}
                  >
                    {slide.badgeIcon}
                    {slide.badgeText}
                  </span>

                  {/* Title */}
                  <h1 className="text-text font-black leading-tight mb-1.5 md:mb-3 text-base sm:text-2xl md:text-4xl">
                    {slide.title}
                  </h1>

                  {/* Lead Text */}
                  <p className="hidden sm:block text-text-muted font-medium text-xs md:text-sm mb-3 md:mb-4">
                    {slide.lead}
                  </p>

                  {/* Mobile-Friendly Buttons */}
                  {slide.to ? (
                    <Link
                      to={slide.to}
                      className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-text font-bold text-xs md:text-base px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-md transition-all active:scale-95"
                    >
                      <span>{slide.buttonText}</span>
                      {slide.buttonIcon}
                    </Link>
                  ) : (
                    <a
                      href={slide.href}
                      className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold text-xs md:text-base px-3 py-1.5 md:px-6 md:py-3 rounded-lg shadow hover:bg-white/25 transition-all"
                    >
                      <span>{slide.buttonText}</span>
                      {slide.buttonIcon}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Indicators */}
        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1 md:h-1.5 rounded-full transition-all ${
                i === current ? "w-5 md:w-6 bg-primary" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityHero;
