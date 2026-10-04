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
    xp: 99,
    streakDays: 30,
    progress: 20,
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
    xp: 45,
    streakDays: 5,
    progress: 20,
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

  // Active User Payload (Password မပါဘဲ သိမ်းဆည်းရန်)
  const activeUser = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    createdAt: user.createdAt || new Date().toISOString().slice(0, 7),
    xp: user.xp || 0,
    streakDays: user.streakDays || 1,
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
    streakDays: 1,
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
  earnedXp,
  chapterTotalLessons = [], // Mock API မှ Chapter ထဲရှိ Lesson ID များ
  journeyTotalChapters = [], // Mock API မှ Journey ထဲရှိ Chapter ID များ
}) => {
  if (!currentUser) return null;

  // 1. Lesson Level Update
  const isAlreadyCompleted = currentUser.completedLessons.includes(lessonId);
  const updatedCompletedLessons = isAlreadyCompleted
    ? currentUser.completedLessons
    : [...currentUser.completedLessons, lessonId];

  // XP တိုးခြင်း (ပထမအကြိမ် ပြီးမှသာ XP ပေါင်းမည်)
  const updatedXp = isAlreadyCompleted
    ? currentUser.xp
    : currentUser.xp + earnedXp;

  // 2. Chapter Level Calculation
  let updatedCompletedChapters = [...(currentUser.completedChapters || [])];
  if (chapterId && chapterTotalLessons.length > 0) {
    const isChapterDone = chapterTotalLessons.every((lId) =>
      updatedCompletedLessons.includes(lId),
    );
    if (isChapterDone && !updatedCompletedChapters.includes(chapterId)) {
      updatedCompletedChapters.push(chapterId);
    }
  }

  // 3. Journey Level Calculation
  let updatedCompletedJourneys = [...(currentUser.completedJourneys || [])];
  if (journeyId && journeyTotalChapters.length > 0) {
    const isJourneyDone = journeyTotalChapters.every((cId) =>
      updatedCompletedChapters.includes(cId),
    );
    if (isJourneyDone && !updatedCompletedJourneys.includes(journeyId)) {
      updatedCompletedJourneys.push(journeyId);
    }
  }

  const updatedUser = {
    ...currentUser,
    xp: updatedXp,
    completedLessons: updatedCompletedLessons,
    completedChapters: updatedCompletedChapters,
    completedJourneys: updatedCompletedJourneys,
  };

  // LocalStorage နှစ်ခုလုံးတွင် ရောက်ရှိအောင် Sync လုပ်မည်
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
