// Original vanilla JS project ရဲ့ create-post.html <select> options
// နဲ့ index.html category filter nav ကို ဒီနေရာမှာ ပေါင်းထားတယ်.
// Real filtering logic (project grid ချိတ်တဲ့အခါ) အတွက် "id" ကို
// project.category field နဲ့ တိုက်ပြီး filter လုပ်မယ်.
import {
  Grid3x3,
  Cpu,
  Network,
  Globe,
  Wifi,
  HardDrive,
  Zap,
  Settings2,
  Bot,
  Volume2,
} from "lucide-react";

export const communityCategories = [
  { id: "all", label: "All categories", icon: Grid3x3 },
  { id: "arduino", label: "Arduino Projects", icon: Cpu },
  { id: "esp32-sensors", label: "ESP32 with Sensors", icon: Network },
  { id: "esp32-webserver", label: "ESP32 Web Server", icon: Globe },
  { id: "esp8266", label: "ESP8266 IoT", icon: Wifi },
  { id: "raspberry-pi", label: "Raspberry Pi & AI", icon: HardDrive },
  { id: "power-solar", label: "Power & Solar", icon: Zap },
  { id: "automation", label: "Automation", icon: Settings2 },
  { id: "robotics", label: "Robotics", icon: Bot },
  { id: "audio-sound", label: "Audio & Sound", icon: Volume2 },
];
