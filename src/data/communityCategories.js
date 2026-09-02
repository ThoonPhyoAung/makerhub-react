import { HandHelping } from "lucide-react";
import {
  LayoutGrid,
  Network,
  Zap,
  Cog,
  Bot,
  Volume2,
  ShieldAlert,
  Rocket,
} from "lucide-react";
import { SiArduino, SiEspressif, SiRaspberrypi } from "react-icons/si";

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

export const postCategoryIcons = {
  "Help & Troubleshooting": ShieldAlert,
  "Project Showcase": Rocket,
};
