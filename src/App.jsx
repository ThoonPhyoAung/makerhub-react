import { Routes, Route } from "react-router-dom";

import WebLayout from "./layout/WebLayout";
import Home from "./pages/home/Home";

// Auth Pages Import
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
// Alert
import { AlertProvider } from "./context/AlertContext"; // named import — curly braces ပါရမယ်
// Learning page
import LearningPage from "./pages/learning";
import JourneyDetail from "./pages/learning/JourneyDetail";
import ChapterDetailPage from "./pages/learning/ChapterDetail";
// import LessonDetailPage from "./pages/learning/LessonDetail";

//community
import CommunityPage from "./pages/community/index";
import CreatePost from "./pages/community/CreatePost";
import PostDetails from "./pages/community/PostDetails";
import EditPost from "./pages/community/EditPost";
// marketplace
import Marketplace from "./pages/marketplace/Marketplace";
import MarketplacePostForm from "./pages/marketplace/MarketplaceCreatePost";
import MarketplaceItemDetails from "./pages/marketplace/MarketplaceItemDetails";
import MarketplaceEditPost from "./pages/marketplace/MarketplaceEditPost";

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

            {/* Learning */}
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/learning/:journeyId" element={<JourneyDetail />} />
            <Route
              path="/learning/:journeyId/:chapterId"
              element={<ChapterDetailPage />}
            />
            {/* <Route
              path="/learning/:journeyId/:chapterId/:lessonSlug"
              element={<LessonDetailPage />}
            /> */}

            {/* community */}
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/create-post" element={<CreatePost />} />
            <Route path="/community/project/:id" element={<PostDetails />} />
            <Route path="/community/edit/:id" element={<EditPost />} />

            {/* marketplace */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/sell" element={<MarketplacePostForm />} />
            <Route
              path="/marketplace/items/:id"
              element={<MarketplaceItemDetails />}
            />
            <Route
              path="/marketplace/edit/:id"
              element={<MarketplaceEditPost />}
            />
          </Route>
        </Routes>
      </div>
    </AlertProvider>
  );
}

export default App;
