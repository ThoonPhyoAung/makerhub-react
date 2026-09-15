import { Routes, Route } from "react-router-dom";

import WebLayout from "./layout/WebLayout";
import Home from "./pages/home/Home";
import Learning from "./pages/learning/Learning";
import JourneyDetail from "./pages/learning/JourneyDetail";
import LessonDetail from "./pages/learning/LessonDetail";
import CommunityPage from "./pages/community/index";
import Marketplace from "./pages/marketplace/Marketplace";

// Auth Pages Import
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
// Alert
import { AlertProvider } from "./context/AlertContext"; // named import — curly braces ပါရမယ်
//community post create form
import CreatePost from "./pages/community/CreatePost";
import PostDetails from "./pages/community/PostDetails";
import EditPost from "./pages/community/EditPost";
// marketplace
import MarketplacePostForm from "./pages/marketplace/MarketplaceCreatePost";

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
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/create-post" element={<CreatePost />} />
            <Route path="/community/project/:id" element={<PostDetails />} />
            <Route path="/community/edit/:id" element={<EditPost />} />

            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/sell" element={<MarketplacePostForm />} />
          </Route>
        </Routes>
      </div>
    </AlertProvider>
  );
}

export default App;
