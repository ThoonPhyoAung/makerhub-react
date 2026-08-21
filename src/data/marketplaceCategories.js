// Original vanilla JS project ရဲ့ index.html category nav (onclick="filterItems(...)")
// ကို ဒီနေရာမှာ data အဖြစ် ပြောင်းထားတယ်. Real filtering logic
// (marketplace item data ချိတ်တဲ့အခါ) အတွက် "id" ကို item.category
// field နဲ့ တိုက်ပြီး filter လုပ်မယ်.
//
// "Saved Items" က category filter မဟုတ်ဘဲ user-specific bookmark
// view ဖြစ်လို့ Firebase Auth ချိတ်မှသာ အပြည့်အစုံ အလုပ်လုပ်နိုင်မယ်.
import {
  Grid3x3,
  Cpu,
  Radio,
  Settings2,
  Tv,
  Boxes,
  Bookmark,
} from "lucide-react";

export const marketplaceCategories = [
  { id: "All", label: "All", icon: Grid3x3 },
  { id: "Microcontroller", label: "Microcontrollers", icon: Cpu },
  { id: "Sensor", label: "Sensors", icon: Radio },
  { id: "Motor", label: "Motors & Servos", icon: Settings2 },
  { id: "Display", label: "Displays", icon: Tv },
  { id: "Components", label: "Components & Others", icon: Boxes },
  { id: "Saved Items", label: "Saved Items", icon: Bookmark },
];
