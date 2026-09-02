// src/utils/iconMap.jsx
import { SiArduino, SiEspressif, SiRaspberrypi } from "react-icons/si";
import {
  Cpu,
  Share2,
  Globe,
  Wifi,
  Zap,
  Cog,
  Bot,
  Volume2,
  LifeBuoy,
} from "lucide-react";

// post.boardTag ကို filter matching (Community.jsx) ရော icon lookup
// (ဒီ RenderIcon) ရော ၂ ခုလုံးအတွက် တွဲသုံးနေလို့ — communityCategories.js
// ရဲ့ id 11 ခုစလုံးနဲ့ ကိုက်အောင် ဒီ map ထဲ ထည့်ထားရပါမယ်, model
// hardware key (arduino/esp32/esp8266/raspberrypi) ၄ ခုပဲ ထားရင်
// compound/topic category (esp32-sensors, power-solar...) တွေအားလုံး
// default Cpu icon ကိုပဲ ရောက်သွားမယ်.
//
// Pure single-board id တွေ → brand logo (react-icons/si)
// Compound/topic id တွေ → communityCategories.js ထဲက ရွေးထားတဲ့ Lucide icon
//   အတူတူပြန်သုံး (nav ပေါ်က icon နဲ့ card ပေါ်က icon တူညီမှု ရှိအောင်)
export const iconMap = {
  // Pure hardware boards — real brand logo
  arduino: SiArduino,
  esp8266: SiEspressif,
  "raspberry-pi": SiRaspberrypi,

  // ESP32 sub-categories — Espressif brand logo ဆက်သုံး (ESP32 ချည်းပဲ
  // ဖြစ်နေလို့)
  "esp32-sensors": SiEspressif,
  "esp32-webserver": SiEspressif,

  // Topic-based categories — brand logo မရှိလို့ communityCategories.js
  // ထဲက icon အတူတူ ပြန်သုံး
  "power-solar": Zap,
  automation: Cog,
  robotics: Bot,
  "audio-sound": Volume2,
  help: LifeBuoy,

  default: Cpu,
};

export const RenderIcon = ({ iconKey, className = "w-6 h-6" }) => {
  const IconComponent = iconMap[iconKey?.toLowerCase()] || iconMap.default;
  return <IconComponent className={className} />;
};
