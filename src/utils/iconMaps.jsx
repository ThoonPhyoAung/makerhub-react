import { ShieldAlert, Rocket, HelpCircle } from "lucide-react";
import { SiArduino, SiEspressif, SiRaspberrypi } from "react-icons/si";

// post.boardTag string ("arduino", "esp32"...) ကို Icon component
// ပြန်ချိတ်ပေးတဲ့ lookup — Card ထဲက title ရှေ့ span display အတွက်.
export const boardIconMap = {
  arduino: SiArduino,
  esp32: SiEspressif,
  esp8266: SiEspressif,
  "raspberry-pi": SiRaspberrypi,
};

// post.category string ("Project Showcase" / "Help & Troubleshooting")
// ကို Icon ပြန်ချိတ်ပေးတဲ့ lookup — Card ရဲ့ top-right badge အတွက်.
export const postCategoryIcons = {
  "Help & Troubleshooting": ShieldAlert,
  "Project Showcase": Rocket,
};

// Generic helper — iconKey ကို map ထဲက ရှာပြီး render လုပ်ပေးတယ်.
// map မတွေ့ရင် (string အသစ်/မမှန်ရင်) fallback icon ပြပေးလို့ crash မဖြစ်ဘူး.
export function RenderIcon({
  iconKey,
  map,
  fallback: Fallback = HelpCircle, //icon ကို default အဖြစ် သုံးတယ်
  ...props //ကျန်တဲ့ prop အားလုံး (ဥပမာ className, size) ကို object တစ်ခုအဖြစ် စုထားတယ်
}) {
  const Icon = map[iconKey?.toLowerCase()?.trim()] ?? Fallback;
  return <Icon {...props} />;
}


