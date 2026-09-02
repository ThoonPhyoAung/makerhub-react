// if api
// import api from "./api";

// doing with local storage
// LocalStorage Keys
const USERS_KEY = "makerhub_users"; // to storage users
const ACTIVE_USER_KEY = "makerhub_active_user"; // to store active user info and data

// Default Initial Mock Users (LocalStorage ထဲ ဘာမှမရှိသေးရင် သုံးရန်)
const defaultUsers = [
  {
    id: "usr_admin",
    name: "System Admin",
    role: "admin", // admin role
    email: "admin@makerhub.mm",
    password: "admin",
    xp: 99,
    streakDays: 30,
    progress: 20,
    completedLessons: [],
  },
  {
    id: "usr_learner",
    name: "Thoon Phyo Aung",
    role: "learner", // learner role
    email: "learner@makerhub.mm",
    password: "123456",
    xp: 45,
    streakDays: 5,
    progress: 20,
    completedLessons: ["esp32-basics-01"],
  },
];

// get user from local storage
const getStoredUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored); // use parse when change string to array obj
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

  //Without Password , save active user info and data
  const activeUser = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    xp: user.xp || 0,
    streakDays: user.streakDays || 1,
    progress: user.progress || 0,
    completedLessons: user.completedLessons || [],
  };

  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

  return {
    status: 1,
    message: "Login successful!",
    data: activeUser,
    role: user.role,
  };
};

// 3. User Sign Up Service (New User Creation)
export const userSignUp = (userData) => {
  const { name, email, password, role = "learner" } = userData;
  const users = getStoredUsers();

  // Checking Same Email
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return { status: 0, message: "Email is already registered!" };
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    role: "learner", // learner role
    email,
    password,
    role,
    xp: 100, // Sign up bonus XP
    streakDays: 1,
    progress: 0,
    completedLessons: [],
  };

  users.push(newUser); //add new user to storedUsers
  localStorage.setItem(USERS_KEY, JSON.stringify(users)); // update localstroage of Users

  // After Sign up , Auto-login
  const activeUser = { ...newUser };
  delete activeUser.password;
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

  return {
    status: 1,
    message: "Account created successfully!",
    data: activeUser,
  };
};

// 4. Delete User Account
export const deleteUserAccount = (userId) => {
  let users = getStoredUsers();
  users = users.filter((u) => u.id !== userId);

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // if Active User , direct Logout
  const activeUser = JSON.parse(localStorage.getItem(ACTIVE_USER_KEY));
  if (activeUser && activeUser.id === userId) {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }

  return {
    status: 1,
    message: "User account deleted successfully!",
  };
};

// 5. Logout Service
export const userLogout = () => {
  localStorage.removeItem(ACTIVE_USER_KEY);
  return { status: 1, message: "Logged out successfully" };
};

// 6. Get Current Active Session User
export const getCurrentUser = () => {
  const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
  return activeUser ? JSON.parse(activeUser) : null;
};
