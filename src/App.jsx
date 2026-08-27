import { Routes, Route } from "react-router-dom";

import WebLayout from "./layout/WebLayout";
import Home from "./pages/home/Home";
import Learning from "./pages/learning/Learning";
import JourneyDetail from "./pages/learning/JourneyDetail";
import LessonDetail from "./pages/learning/LessonDetail";
import Community from "./pages/community/Community";
import Marketplace from "./pages/marketplace/Marketplace";
import CreatePost from "./pages/community/CreatePost";
// Auth Pages Import
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
// Alert
import { AlertProvider } from "./context/AlertContext";  // ✅ named import — curly braces ပါရမယ်

function App() {
  return (
    <AlertProvider>
      <div>
        <Routes>
          {/* User Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Login Route */}
          <Route path="/admin" element={<Login />} />

          {/* Signup */}
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Layout */}

          {/* Weblayout */}
          <Route element={<WebLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/learning/:journeyId" element={<JourneyDetail />} />
            <Route
              path="/learning/:journeyId/:lessonSlug"
              element={<LessonDetail />}
            />
            <Route path="/community" element={<Community />} />
            <Route path="/community/create-post" element={<CreatePost />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Route>
        </Routes>
      </div>
    </AlertProvider>
  );
}

export default App;
