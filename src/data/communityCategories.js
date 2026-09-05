import { LayoutGrid, Zap, Cog, Bot, Volume2, ShieldAlert } from "lucide-react";
import { SiArduino, SiEspressif, SiRaspberrypi } from "react-icons/si";

// Nav display data ချည်းသက်သက်ပါ (id/label/icon) — Nav bar ရော
// နောက်ပိုင်း post-create form (Post Type dropdown) ရော
// ဒီ list ကို reuse လုပ်နိုင်တယ်.
//
// Filter logic:
// - "all"  → filter မလုပ်ဘူး
// - "help" → post.category === "Help & Troubleshooting" ကို filter
// - ကျန်တာအားလုံး → post.category === "Project Showcase" && post.pjType === id
export const communityCategories = [
  { id: "all", label: "All categories", icon: LayoutGrid },
  { id: "arduino", label: "Arduino Projects", icon: SiArduino },
  { id: "esp32", label: "ESP32 Projects", icon: SiEspressif },
  { id: "esp8266", label: "ESP8266 IoT", icon: SiEspressif },
  { id: "raspberry-pi", label: "Raspberry Pi & AI", icon: SiRaspberrypi },
  { id: "power-solar", label: "Power & Solar", icon: Zap },
  { id: "automation", label: "Automation", icon: Cog },
  { id: "robotics", label: "Robotics", icon: Bot },
  { id: "audio-sound", label: "Audio & Sound", icon: Volume2 },
  { id: "help", label: "Help & Troubleshooting", icon: ShieldAlert },
];
