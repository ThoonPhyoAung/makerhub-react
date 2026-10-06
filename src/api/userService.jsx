// LocalStorage Keys
const USERS_KEY = "makerhub_users";
const ACTIVE_USER_KEY = "makerhub_active_user";

// Default Initial Mock Users
const defaultUsers = [
  {
    id: "usr_admin",
    name: "System Admin",
    role: "admin",
    email: "admin@makerhub.mm",
    password: "admin",
    createdAt: "2025-08-15",
    xp: 0,
    streakDays: 0,
    progress: 0,
    completedLessons: [],
    completedChapters: [],
    completedJourneys: [],
  },
  {
    id: "usr_learner",
    name: "Thoon Phyo Aung",
    role: "learner",
    email: "learner@makerhub.mm",
    password: "123456",
    createdAt: "2025-08-15",
    xp: 0,
    streakDays: 0,
    progress: 0,
    completedLessons: ["esp32-basics-01"],
    completedChapters: [],
    completedJourneys: [],
  },
];

// LocalStorage ထဲမှ Users အားလုံးကို ဆွဲယူခြင်း
const getStoredUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};

// Helper: Active User ရော Users List ပါ နှစ်ခုစလုံး Sync ဖြစ်အောင် Update လုပ်ပေးသည့် Function
export const syncUserStorage = (updatedUser) => {
  // 1. Update Active User Session
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updatedUser));

  // 2. Update Main Users DB Array
  const users = getStoredUsers();
  const userIndex = users.findIndex((u) => u.id === updatedUser.id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// 1. Get All Users List
export const getUsers = () => {
  const users = getStoredUsers();
  return {
    status: "ok",
    message: "Fetch User Data Successful",
    data: users,
  };
};

// 2. User Login Service
export const userLogin = (userinfo) => {
  const { email, password } = userinfo;
  const users = getStoredUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { status: 0, message: "User not found!" };
  }

  if (user.password !== password) {
    return { status: 0, message: "Invalid Email or Password" };
  }

  // streakDates array မှ streakDays ကို တွက်မည်
  const userStreakDates = Array.isArray(user.streakDates)
    ? user.streakDates
    : [];
  const calculatedStreakDays = userStreakDates.length;

  // Active User Payload (Password မပါဘဲ သိမ်းဆည်းရန်)
  const activeUser = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    createdAt: user.createdAt || new Date().toISOString().slice(0, 7),
    xp: user.xp || 0,
    streakDates: userStreakDates,
    streakDays: calculatedStreakDays, // 📍 1 အစား 0 သို့မဟုတ် အမှန်တကယ် ရှိသော length ကိုယူမည်
    progress: user.progress || 0,
    completedLessons: user.completedLessons || [],
    completedChapters: user.completedChapters || [],
    completedJourneys: user.completedJourneys || [],
  };

  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

  return {
    status: 1,
    message: "Login successful!",
    data: activeUser,
    role: user.role,
  };
};

// 3. User Sign Up Service
export const userSignUp = (userData) => {
  const { name, email, password, role = "learner" } = userData;
  const users = getStoredUsers();

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return { status: 0, message: "Email is already registered!" };
  }

  const currentMonthYear = new Date().toISOString().slice(0, 7);

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    role: "learner",
    email,
    password,
    createdAt: currentMonthYear,
    xp: 100, // Bonus XP
    streakDates: [], // 📍 Signup စလုပ်ချိန်တွင် Array အလွတ် ဖြစ်မည်
    streakDays: 0, // 📍 Signup စလုပ်ချိန်တွင် 0 ဖြစ်မည်
    progress: 0,
    completedLessons: [],
    completedChapters: [],
    completedJourneys: [],
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const activeUser = { ...newUser };
  delete activeUser.password;
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

  return {
    status: 1,
    message: "Account created successfully!",
    data: activeUser,
  };
};

// 4. Update User Progress & Sync (Complete Lesson Logic)
export const completeLessonLogic = ({
  currentUser,
  lessonId,
  chapterId,
  journeyId,
  earnedXp = 0,
  chapterTotalLessons = [],
  journeyTotalChapters = [],
  totalPlatformLessonsCount = 0,
}) => {
  if (!currentUser) return null;

  const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  // 1. Lesson & XP Updates
  const isAlreadyCompleted = (currentUser.completedLessons || []).some(
    (id) => String(id) === String(lessonId),
  );

  const updatedCompletedLessons = isAlreadyCompleted
    ? currentUser.completedLessons
    : [...(currentUser.completedLessons || []), lessonId];

  const updatedXp = isAlreadyCompleted
    ? currentUser.xp
    : (currentUser.xp || 0) + earnedXp;

  // 2. Streak Dates Array Logic (အစ်ကို့ Idea အတိုင်း)
  const currentStreakDates = Array.isArray(currentUser.streakDates)
    ? currentUser.streakDates
    : [];

  // ဒီနေ့ ရက်စွဲ Array ထဲမှာ မပါသေးရင် ထည့်မည်
  const updatedStreakDates = currentStreakDates.includes(todayStr)
    ? currentStreakDates
    : [...currentStreakDates, todayStr];

  // Streak Days Count သည် streakDates Array ရဲ့ Length ဖြစ်မည်
  const updatedStreakDays = updatedStreakDates.length;

  // 3. Chapter Level Calculation
  let updatedCompletedChapters = [...(currentUser.completedChapters || [])];
  if (chapterId && chapterTotalLessons.length > 0) {
    const isChapterDone = chapterTotalLessons.every((lId) =>
      updatedCompletedLessons.includes(lId),
    );
    if (isChapterDone && !updatedCompletedChapters.includes(chapterId)) {
      updatedCompletedChapters.push(chapterId);
    }
  }

  // 4. Journey Level Calculation
  let updatedCompletedJourneys = [...(currentUser.completedJourneys || [])];
  if (journeyId && journeyTotalChapters.length > 0) {
    const isJourneyDone = journeyTotalChapters.every((cId) =>
      updatedCompletedChapters.includes(cId),
    );
    if (isJourneyDone && !updatedCompletedJourneys.includes(journeyId)) {
      updatedCompletedJourneys.push(journeyId);
    }
  }

  // 5. Progress Calculation
  const updatedProgress =
    totalPlatformLessonsCount > 0
      ? Math.min(
          Math.round(
            (updatedCompletedLessons.length / totalPlatformLessonsCount) * 100,
          ),
          100,
        )
      : 0;

  const updatedUser = {
    ...currentUser,
    xp: updatedXp,
    streakDates: updatedStreakDates, // 📍 Array အဖြစ် သိမ်းမည်
    streakDays: updatedStreakDays, // 📍 Array ရဲ့ length
    lastActiveDate: todayStr,
    progress: updatedProgress,
    completedLessons: updatedCompletedLessons,
    completedChapters: updatedCompletedChapters,
    completedJourneys: updatedCompletedJourneys,
  };

  syncUserStorage(updatedUser);

  return updatedUser;
};

// 5. Delete User Account
export const deleteUserAccount = (userId) => {
  let users = getStoredUsers();
  users = users.filter((u) => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const activeUser = JSON.parse(localStorage.getItem(ACTIVE_USER_KEY));
  if (activeUser && activeUser.id === userId) {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }

  return { status: 1, message: "User account deleted successfully!" };
};

// 6. Logout Service
export const userLogout = () => {
  localStorage.removeItem(ACTIVE_USER_KEY);
  return { status: 1, message: "Logged out successfully" };
};

// 7. Get Current Active Session User
export const getCurrentUser = () => {
  const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
  return activeUser ? JSON.parse(activeUser) : null;
};
