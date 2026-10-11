import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

function Unauthorized() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
      <ShieldAlert size={40} className="text-red-400" />
      <h1 className="text-2xl font-bold text-text">Access Denied</h1>
      <p className="text-text-muted text-sm">ဒီစာမျက်နှာကို ဝင်ခွင့်မရှိပါ။</p>
      <Link to="/" className="text-primary font-semibold text-sm">
        ← Back to Home
      </Link>
    </div>
  );
}

export default Unauthorized;
