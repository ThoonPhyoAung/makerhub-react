import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessagesSquare,
  Store,
  GraduationCap,
  Map as MapIcon,
  Layers,
  BookOpen,
  ChevronDown,
  ArrowLeft,
  Cpu,
  X,
} from "lucide-react";

const mainItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/community", label: "Community Posts", icon: MessagesSquare },
  { to: "/admin/marketplace", label: "Market Items", icon: Store },
];

const learningItems = [
  { to: "/admin/learning/journeys", label: "Journeys", icon: MapIcon },
  { to: "/admin/learning/chapters", label: "Chapters", icon: Layers },
  { to: "/admin/learning/lessons", label: "Lessons", icon: BookOpen },
];

{
  /* 3. React Router ၏ NavLink မှတဆင့် လက်ရှိရောက်နေသော Page ကို အလိုအလျောက် သိရှိစေရန် ({ isActive }) 
  at <NavLink> auto incluede {isActive}*/
}
const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary/15 text-primary font-semibold"
      : "text-text-muted hover:text-text hover:bg-surface"
  }`;

function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const isLearningActive = pathname.startsWith("/admin/learning");
  const [learningOpen, setLearningOpen] = useState(isLearningActive);

  useEffect(() => {
    if (isLearningActive) setLearningOpen(true);
  }, [isLearningActive]);

  return (
    <>
      {/* Mobile Backdrop */}
      {/* 1. ဖုန်းဖြင့်ကြည့်စဉ် Sidebar ပွင့်လာပါက နောက်ခံကို အမည်းရောင်ဖျော့ဖျော့ (Backdrop) ပြရန် */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      {/* 2. ဖုန်းတွင် ဘယ်ဘက်မှ Slide လုပ်၍ ထွက်လာရန်၊ ကွန်ပျူတာတွင် ပုံသေပေါ်နေရန် */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-bg-elevated border-r border-border p-4 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo & Close button for mobile */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <Link to="/" className="flex items-center gap-2">
            <Cpu size={22} className="text-primary" />
            <span className="text-text font-bold text-lg">
              Maker<span className="text-primary">Hub</span> Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-text-muted hover:text-text bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
          {mainItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} className={linkClass}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}

          {/* Learning group */}
          <div className="flex flex-col gap-1 mt-1">
            <button
              type="button"
              onClick={() => setLearningOpen((prev) => !prev)}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isLearningActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text hover:bg-surface"
              }`}
            >
              <span className="flex items-center gap-3">
                <GraduationCap size={18} /> Learning
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  learningOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`flex flex-col gap-1 ml-4 pl-3 border-l border-border ${
                learningOpen ? "flex" : "hidden"
              }`}
            >
              {learningItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={linkClass}
                >
                  <Icon size={16} /> {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Back to site */}
        <div className="pt-4 border-t border-border mt-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-text-subtle hover:text-text hover:bg-surface transition-colors"
          >
            <ArrowLeft size={16} /> Back to main site
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
