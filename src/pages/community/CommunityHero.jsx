import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAlert } from "../../context/AlertContext";
import { ArrowRight, Images, PlusCircle, Cpu } from "lucide-react";

const slides = [
  {
    id: "featured-hardware",
    image: "/assets/Project.hub-Hero-Banner.jpg",
    badgeIcon: <Cpu className="w-3.5 h-3.5 text-amber-400" />,
    badgeText: "Featured Hardware",
    badgeDotColor: "bg-amber-400",
    title: "Arduino VENTUNO Q",
    lead: "Where AI takes action. Explore cutting-edge DIY projects powered by edge computing.",
    buttonText: "Explore Projects",
    buttonIcon: <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />,
    to: "#projectsSection",
    requiresAuth: false,
    isPrimaryBtn: true,
  },
  {
    id: "community-showcase",
    image: "/assets/esp32-s31-banner.png",
    badgeIcon: <Images className="w-3.5 h-3.5 text-sky-400" />,
    badgeText: "Community Showcase",
    badgeDotColor: "bg-sky-400",
    title: "ESP32-S31 Series",
    lead: "See what fellow makers are building with next-gen Wi-Fi & AI capabilities.",
    buttonText: "View Maker Projects",
    buttonIcon: <Images className="w-3.5 h-3.5 md:w-4 md:h-4" />,
    to: "#categoryNavBar",
    requiresAuth: false,
    isPrimaryBtn: false,
  },
  {
    id: "learning-hub",
    image: "/assets/hero_img.png",
    badgeIcon: <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />,
    badgeText: "Arduino Learning Hub",
    badgeDotColor: "bg-emerald-400",
    title: "Build, Learn, Share",
    lead: "Join fellow developers in mastering embedded systems. Showcase your electronics and code.",
    buttonText: "Share Your Project",
    buttonIcon: <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />,
    to: "/community/create-post",
    requiresAuth: true,
    isPrimaryBtn: true,
  },
];

function CommunityHero() {
  const activeUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const showAlert = useAlert();

  const checkAuth = () => {
    if (!activeUser) {
      showAlert({
        title: "Authentication Required",
        message: "Please Login First to Create Posts.",
        type: "warning",
        actionText: "Go to Login",
        onAction: () => navigate("/login"),
      });
      return false;
    }
    return true;
  };

  const handleButtonClick = (e, requiresAuth) => {
    if (requiresAuth && !checkAuth()) {
      e.preventDefault();
    }
  };

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 my-4">
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-border/40 h-[210px] sm:h-[260px] md:h-[360px]">
        {slides.map((slide, i) => {
          const isCurrent = i === current;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-linear"
              />

              {/* Gradient Dark Overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent md:to-black/20" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="px-5 sm:px-8 md:px-12 max-w-xl">
                  {/* Glassmorphic Badge Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold mb-2 md:mb-4 bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${slide.badgeDotColor} animate-pulse`}
                    />
                    {slide.badgeIcon}
                    <span>{slide.badgeText}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-white font-black leading-tight mb-2 md:mb-3 text-lg sm:text-2xl md:text-4xl drop-shadow-md tracking-tight">
                    {slide.title}
                  </h1>

                  {/* Lead Description */}
                  <p className="hidden sm:block text-gray-200/90 font-medium text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 leading-relaxed max-w-md">
                    {slide.lead}
                  </p>

                  {/* Dynamic CTA Button */}
                  <Link
                    to={slide.to}
                    onClick={(e) => handleButtonClick(e, slide.requiresAuth)}
                    className={`inline-flex items-center gap-2 font-bold text-xs md:text-sm px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
                      slide.isPrimaryBtn
                        ? "bg-primary text-black hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/40"
                        : "bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white"
                    }`}
                  >
                    <span>{slide.buttonText}</span>
                    {slide.buttonIcon}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-7 md:w-8 bg-primary shadow-sm"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityHero;