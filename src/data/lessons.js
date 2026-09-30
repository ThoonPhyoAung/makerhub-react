export const lessons = [
  // --- Arduino (Wokwi Simulator) ---
  {
    id: "arduino-01",
    journeyId: "arduino-uno",
    chapterId: "ch-1",
    slug: "getting-started",
    order: 1,
    title: "Getting Started with Arduino",
    xpReward: 50,
    content:
      "Arduino board ရဲ့ parts, IDE setup, နဲ့ ပထမဆုံး sketch upload လုပ်နည်း အကျဉ်းချုပ်။",
  },
  {
    id: "uno-basics",
    journeyId: "arduino-uno",
    chapterId: "ch-1",
    slug: "uno-basics",
    order: 2,
    title: "Your First Blinking LED",
    xpReward: 75,
    // Arduino အတွက် Wokwi Simulator သုံးမည်
    simulator: {
      type: "wokwi",
      id: "476144724285786113",
    },
    content:
      "digitalWrite() နဲ့ delay() သုံးပြီး LED blink လုပ်တဲ့ classic beginner project ဖြစ်ပါတယ်။ အောက်ပါ Wokwi Simulator မှာ Run ကို နှိပ်ပြီး စမ်းသပ်ကြည့်ပါ။",
  },
  {
    id: "arduino-03",
    journeyId: "arduino-uno",
    chapterId: "ch-2",
    slug: "reading-sensors",
    order: 3,
    title: "Reading Sensor Data",
    xpReward: 75,
    content:
      "analogRead() သုံးပြီး sensor value ဖတ်တာ, Serial Monitor မှာ ပြတာ။",
  },

  // --- ESP32 (Velxio Simulator) ---
  {
    id: "esp32-cam-01",
    journeyId: "esp32",
    chapterId: "ch-1",
    slug: "esp32-wifi",
    order: 1,
    title: "ESP32-CAM Live Simulation",
    xpReward: 100,
    // ESP32 အတွက် Velxio Simulator သုံးမည်
     simulator: {
      type: "wokwi",
      id: "476144724285786113",
    },
    content:
      "ESP32-CAM စမ်းသပ်ရန် Velxio Live Simulator ဖြစ်ပါတယ်။ အောက်ပါ Simulator တွင် တိုက်ရိုက် စမ်းသပ်နိုင်ပါတယ်။",
  },
];

export function getLessonsByJourney(journeyId) {
  return lessons
    .filter((l) => l.journeyId === journeyId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsByChapter(journeyId, chapterId) {
  return lessons
    .filter((l) => l.journeyId === journeyId && l.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
}
