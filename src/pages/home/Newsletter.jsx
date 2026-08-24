import { useState } from "react";
import { Mail } from "lucide-react";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Firebase/Email service ချိတ်ပြီးရင် Subscribe logic ထည့်မယ်
    console.log("Subscribing:", email);
  };

  return (
    <section className="py-10 md:py-16 bg-bg-elevated border-y border-border">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-text text-2xl md:text-3xl font-bold mb-2">
          <Mail size={32} className="text-white" />
          Stay updated with MakerHub MM
        </h2>
        <p className="text-text-muted text-lg mb-8">
          Get the latest tutorials, projects, and IoT news in Myanmar
        </p>

        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="flex-1 min-w-0 bg-bg-subtle border border-border-muted text-text placeholder:text-text-subtle rounded-l-lg px-5 h-[50px] focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            className="bg-primary text-white font-bold px-6 h-[50px] rounded-r-lg hover:brightness-110 active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
