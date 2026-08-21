import { Link } from "react-router-dom";
import { ShoppingCart, PlusCircle, Cpu, Radio, Settings2 } from "lucide-react";

// Original market.css ရဲ့ .market-hero က theme (dark/light) ကို ဂရုမစိုက်ဘဲ
// #06090a dark cyber background ကို force ထားတာမို့ ဒီနေရာမှာလည်း
// bg-bg token မသုံးဘဲ တမင် hardcode ထားတယ်.
function MarketplaceHero() {
  return (
    <div className="relative bg-[#06090a] overflow-hidden border-b border-white/5">
      {/* Tech grid lines — market.css: 40px grid, opacity 0.015 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient glows — green bottom-left, purple top-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 15% 30%, rgba(34,197,94,0.08) 0%, transparent 50%),
                        radial-gradient(circle at 85% 70%, rgba(139,92,246,0.06) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16 grid lg:grid-cols-2 gap-10 items-center min-h-[290px]">
        {/* LEFT — copy + CTA */}
        <div className="text-center lg:text-left">
          <h1 className="text-text font-black text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            Trade & Sell
            <span className="block w-full lg:w-auto" />
            <span className="text-primary drop-shadow-[0_0_20px_rgba(34,197,94,0.35)]">
              Maker Hardware
            </span>
            <ShoppingCart size={28} className="text-primary" />
          </h1>
          <p className="text-text-muted text-base leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
            The central hub to buy, sell, and trade microcontrollers, sensors,
            and electronic components. Find hard-to-get modules or clear out
            your workspace!
          </p>

          <Link
            to="/marketplace/sell"
            className="inline-flex items-center gap-2 bg-primary text-black font-bold px-5 py-3 rounded-[10px] shadow-[0_4px_20px_rgba(34,197,94,0.25)] hover:brightness-95 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(13,148,136,0.45)] transition-all"
          >
            <PlusCircle size={18} /> Sell an Item
          </Link>
        </div>

        {/* RIGHT — decorative floating cards (desktop only) */}
        <div className="hidden lg:flex relative items-center justify-center min-h-[290px]">
          <div className="absolute w-28 h-20 bg-[#11161d] border border-white/5 rounded-xl shadow-2xl flex items-center justify-center animate-float scale-90 -translate-x-16">
            <Cpu size={26} className="text-primary" />
          </div>
          <div
            className="absolute w-32 h-24 bg-[#11161d] border border-white/5 rounded-xl shadow-2xl flex items-center justify-center animate-float translate-y-[-40px] rotate-2 z-[3]"
            style={{ animationDelay: "1.2s" }}
          >
            <Radio size={30} className="text-purple-400" />
          </div>
          <div
            className="absolute w-36 h-28 bg-[#11161d] border border-white/5 rounded-xl shadow-2xl flex items-center justify-center animate-float translate-x-16 translate-y-4 -rotate-2 z-[4] scale-110"
            style={{ animationDelay: "2.4s" }}
          >
            <Settings2 size={34} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceHero;
