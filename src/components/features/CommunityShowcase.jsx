import { ArrowRight, Loader2 } from "lucide-react";

function CommunityShowcase() {
  // TODO: Firebase ချိတ်ပြီးရင် ဒီ Loading state ကို Real data နဲ့ အစားထိုးမယ်
  const isLoading = true;

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-border">
          <h2 className="text-text text-2xl font-bold">Community Showcase</h2>

          <a
            href="/community"
            className="flex items-center gap-2 text-text font-semibold text-sm hover:text-primary transition-colors shrink-0 whitespace-nowrap"
          >
            <span className="hidden sm:inline">View Community</span>
            <span className="sm:hidden text-text-muted">View All</span>
            <ArrowRight size={15} />
          </a>
        </div>

        {isLoading ? (
          <div className="text-center py-6">
            <Loader2
              size={32}
              className="mx-auto text-primary animate-spin mb-3"
            />
            <p className="text-text-muted">Loading project details...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Firebase data ရလာရင် ဒီထဲမှာ Project Card တွေ .map() နဲ့ Render လုပ်မယ် */}
          </div>
        )}
      </div>
    </section>
  );
}

export default CommunityShowcase;
