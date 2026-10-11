import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

function AdminLayout() {
  // 1. Sidebar ပွင့်နေလား/ပိတ်နေလား ထိန်းချုပ်မယ့် State (Default = ပိတ်ထားမည်)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text flex">
      {/* Sidebar Drawer */}
      {/* 2. Sidebar ဖိုင်သို့ isOpen အခြေအနေနှင့် ပိတ်မယ့် function ကို ပို့ပေးခြင်း */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* onClose is to close when other click detected */}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* get click btn from Navbar to open and close sidebar function */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {/* 3. Navbar သို့ Sidebar ဖွင့်/ပိတ်လုပ်မယ့် toggle function ကို ပို့ပေးခြင်း */}

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
