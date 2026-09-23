import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, PlusCircle, MapPin, Bookmark, Tag } from "lucide-react";
import { useSelector } from "react-redux"; //for checking current user login
import { useAlert } from "../../context/AlertContext";

// Original market.css ရဲ့ .market-hero က theme (dark/light) ကို ဂရုမစိုက်ဘဲ
// #06090a dark cyber background ကို force ထားတာမို့ ဒီနေရာမှာလည်း
// bg-bg token မသုံးဘဲ တမင် hardcode ထားတယ်.
function MarketplaceHero({ items = [] }) {
  // current login user
  const activeUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // check login user for sell item create
  const showAlert = useAlert();
  const checkAuth = () => {
    if (!activeUser) {
      showAlert({
        title: "Authentication Required",
        message: "Please Login First to Sell Your Items.",
        type: "warning",
        actionText: "Go to Login",
        onAction: () => navigate("/login"),
      });
      return false;
    }
    return true;
  };

  // sell item btn click
  const handleSellClick = (e) => {
    if (!checkAuth()) {
      e.preventDefault(); // Login မဝင်ထားပါက Link သွားခြင်းကို တားဆီးမည်
    }
  };

  // နောက်ဆုံးတင်ထားသော Latest 3 Items ကို ယူခြင်း
  const latestThree = items.length
    ? [...items]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
    : [];

  // 🚀 Card 3 ခုအတွက် Sizing (Small -> Medium -> Big) + ItemCard Content Formatting
  const cardConfigs = [
    {
      // Card 1: Smallest (Left Back)
      containerClass: "w-[120px] scale-90 -translate-x-40 z-[2] -rotate-4",
      imgHeight: "h-[75px]",
    },
    {
      // Card 2: Medium (Center Top)
      containerClass: "w-[140px] scale-100 -translate-y-13 rotate-2 z-[3]",
      imgHeight: "h-[90px]",
    },
    {
      // Card 3: Biggest (Right Front)
      containerClass:
        "w-[165px] scale-110 translate-x-34 translate-y-6 -rotate-2 z-[4]",
      imgHeight: "h-[105px]",
    },
  ];

  const delays = ["0s", "1.2s", "2.4s"];

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
            onClick={handleSellClick}
            className="inline-flex items-center gap-2 bg-primary text-black font-bold px-5 py-3 rounded-[10px] shadow-[0_4px_20px_rgba(34,197,94,0.25)] hover:brightness-95 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(13,148,136,0.45)] transition-all"
          >
            <PlusCircle size={18} /> Sell an Item
          </Link>
        </div>

        {/* RIGHT — Compact Floating Cards (Matches JS width: 130px style) */}
        <div className="hidden lg:flex relative items-center justify-center min-h-[300px]">
          {latestThree.length > 0 ? (
            latestThree.reverse().map((item, index) => {
              const itemId = item._id || item.id;
              const mainImage =
                item.images && item.images.length > 0 ? item.images[0] : null;

              // Location safely formatting
              const locationText =
                typeof item.location === "object"
                  ? [item.location.township, item.location.state]
                      .filter(Boolean)
                      .join(", ")
                  : item.location;

              const config = cardConfigs[index] || cardConfigs[1];

              return (
                <div
                  key={itemId || index}
                  style={{ animationDelay: delays[index] }}
                  className={`absolute animate-float transition-all duration-300 hover:-translate-y-2 hover:brightness-110 group ${config.containerClass}`}
                >
                  <Link
                    to={`/marketplace/items/${itemId}`}
                    className="block bg-bg-elevated border border-border rounded-xl overflow-hidden shadow-2xl transition-colors hover:border-primary/50"
                  >
                    {/* Image Area + Condition Badge + Price Badge */}
                    <div
                      className={`relative w-full ${config.imgHeight} bg-bg overflow-hidden`}
                    >
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px]">
                          No Image
                        </div>
                      )}

                      {/* Condition Badge */}
                      {item.condition && (
                        <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-md text-text-muted text-[8px] px-1.5 py-0.5 rounded font-medium border border-white/10">
                          {item.condition}
                        </span>
                      )}

                      {/* Price Badge */}
                      <span className="absolute bottom-1.5 right-1.5 bg-primary text-black font-black text-[10px] px-1.5 py-0.5 rounded shadow">
                        ${item.price}
                      </span>
                    </div>

                    {/* Item Card Content (Matches React ItemCard structure) */}
                    <div className="p-2 flex flex-col gap-1">
                      <h4 className="text-[11px] font-bold text-text truncate">
                        {item.title}
                      </h4>

                      <div className="flex items-center justify-between text-[9px] text-text-muted">
                        <span className="inline-flex items-center gap-0.5 truncate">
                          <Tag size={9} className="text-primary shrink-0" />
                          <span className="truncate">
                            {item.category || "General"}
                          </span>
                        </span>
                        {locationText && (
                          <span className="inline-flex items-center gap-0.5 truncate max-w-[60px]">
                            <MapPin size={9} className="shrink-0" />
                            <span className="truncate">{locationText}</span>
                          </span>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-1 mt-0.5 border-t border-border/60 flex items-center justify-between text-[9px] text-text-muted">
                        <span className="truncate max-w-[70px] font-medium">
                          {item.seller?.username || item.sellerName || "Seller"}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Bookmark size={9} />
                          <span>{item.savedUsers.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-text-muted text-xs border border-dashed border-border/40 p-4 rounded-xl">
              No recent items available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceHero;
