// TODO: TR ကနေ real content (text/image/code/quiz block) ရလာရင်
// ဒီ placeholder lessons တွေကို အစားထိုးမယ်။ ခုချိန်မှာတော့
// route/layout/navigation logic ကို စမ်းဖို့အတွက်ပဲ ဒါလေးထားထားတယ်.
//
// journeyId က data/journeys.js ထဲက journey.id တွေနဲ့ တူညီရမယ်
// (ယူဆချက်: "arduino", "esp32", "esp8266", "raspberry-pi").
// journeys.js ထဲက id တွေ မတူရင် ဒီနေရာက journeyId string တွေကို
// ချိန်ညှိပေးရမယ်။
//
// content က အခုတော့ plain string ချည်းပါ — TR ကနေ format
// ဆုံးဖြတ်ပြီးမှ block array ({ type, value }) ပြောင်းမယ်.
// Burmese/English switch (i18n) လုပ်တဲ့အခါ title/content string
// တွေကို key-based object (title: { mm: "...", en: "..." }) ပြောင်းဖို့
// လွယ်အောင် အခုအတိုင်း flat string ထားထားတာ — deep concatenation
// မလုပ်ထားလို့ swap လုပ်ရင် lesson object တစ်ခုချင်းစီပဲ ပြင်ရမယ်.

export const lessons = [
  {
    id: "arduino-01",
    journeyId: "arduino",
    slug: "getting-started",
    order: 1,
    title: "Getting Started with Arduino",
    xpReward: 50,
    content:
      "Placeholder lesson content. Arduino board ရဲ့ parts, IDE setup, နဲ့ ပထမဆုံး sketch upload လုပ်နည်း အကျဉ်းချုပ်။ Real content ကို TR ရလာရင် ဒီနေရာမှာ ထည့်မယ်။",
  },
  {
    id: "arduino-02",
    journeyId: "arduino",
    slug: "blinking-led",
    order: 2,
    title: "Your First Blinking LED",
    xpReward: 75,
    content:
      "Placeholder lesson content. digitalWrite() နဲ့ delay() သုံးပြီး LED blink လုပ်တဲ့ classic beginner project.",
  },
  {
    id: "arduino-03",
    journeyId: "arduino",
    slug: "reading-sensors",
    order: 3,
    title: "Reading Sensor Data",
    xpReward: 75,
    content:
      "Placeholder lesson content. analogRead() သုံးပြီး sensor value ဖတ်တာ, Serial Monitor မှာ ပြတာ.",
  },

  // esp32 / esp8266 / raspberry-pi journeys: lesson content မရေးရသေးဘူး —
  // getLessonsByJourney() က empty array ပြန်ပေးမှာမို့ JourneyDetail
  // page ထဲမှာ "Coming soon" empty state ကိုယ်တိုင် ပြပါလိမ့်မယ်.
];

// journeyId နဲ့ filter + order နဲ့ sort လုပ်ပေးတဲ့ helper.
// array index အစား order field ကို သုံးလို့ lesson အသစ်
// ကြားညှပ်ထည့်ချင်ရင် index အားလုံး ပြန်မရေးရဘူး.
export function getLessonsByJourney(journeyId) {
  return lessons
    .filter((l) => l.journeyId === journeyId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(journeyId, slug) {
  return lessons.find((l) => l.journeyId === journeyId && l.slug === slug);
}
