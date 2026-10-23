import { Routes, Route } from "react-router-dom";

import WebLayout from "./layout/WebLayout";
import Home from "./pages/home/Home";

// Admin Panel
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBaseRoute from "./components/RoleBaseRoute";
import AdminLayout from "./layout/AdminLayout";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import CommunityPosts from "./pages/admin/CommunityPosts";
import MarketItems from "./pages/admin/MarketItems";

import JourneysIndex from "./pages/admin/learning/Journeys/JourneysIndex";
import JourneyCreate from "./pages/admin/learning/Journeys/JourneyCreate";
import JourneyEdit from "./pages/admin/learning/Journeys/JourneyEdit";

import ChaptersIndex from "./pages/admin/learning/Chapters/ChaptersIndex";
import ChapterCreate from "./pages/admin/learning/Chapters/ChapterCreate";
import ChapterEdit from "./pages/admin/learning/Chapters/ChapterEdit";

import LessonsIndex from "./pages/admin/learning/Lessons/LessonsIndex";
import LessonCreate from "./pages/admin/learning/Lessons/LessonCreate";
import LessonEdit from "./pages/admin/learning/Lessons/LessonEdit";

// Theme
import { ThemeProvider } from "./context/ThemeContext";
// Scroll
import ScrollToTop from "./components/ScrollToTop";

// Profile
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";

// Auth Pages Import
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
// Alert
import { AlertProvider } from "./context/AlertContext"; // named import — curly braces ပါရမယ်
// Learning page
import LearningPage from "./pages/learning";
import JourneyDetail from "./pages/learning/JourneyDetail";
import ChapterDetailPage from "./pages/learning/ChapterDetail";
import LessonDetailPage from "./pages/learning/LessonDetail/";
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
      <ThemeProvider>
        <div>
          <ScrollToTop />
          <Routes>
            {/* Unathorized */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* User Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/" element={<Login />} />

            {/* Signup */}
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Panel for only one admin*/}
            <Route element={<ProtectedRoute redirectTo="/admin" />}>
              <Route element={<RoleBaseRoute allowedRoles={["admin"]} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/community" element={<CommunityPosts />} />
                  <Route path="/admin/marketplace" element={<MarketItems />} />
                  <Route
                    path="/admin/learning/journeys"
                    element={<JourneysIndex />}
                  />
                  <Route
                    path="/admin/learning/journeys/create"
                    element={<JourneyCreate />}
                  />
                  <Route
                    path="/admin/learning/journeys/edit/:id"
                    element={<JourneyEdit />}
                  />
                  <Route
                    path="/admin/learning/chapters"
                    element={<ChaptersIndex />}
                  />
                  <Route
                    path="/admin/learning/chapters/create"
                    element={<ChapterCreate />}
                  />
                  <Route
                    path="/admin/learning/chapters/edit/:journeySystemId/:chapterId"
                    element={<ChapterEdit />}
                  />
                  <Route
                    path="/admin/learning/lessons"
                    element={<LessonsIndex />}
                  />
                  <Route
                    path="/admin/learning/lessons/create"
                    element={<LessonCreate />}
                  />
                  <Route
                    path="/admin/learning/lessons/edit/:lessonId"
                    element={<LessonEdit />}
                  />
                </Route>
              </Route>
            </Route>

            {/* Weblayout */}
            <Route element={<WebLayout />}>
              <Route path="/" element={<Home />} />

              {/* Profile */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />

              {/* Learning */}
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/learning/:journeyId" element={<JourneyDetail />} />
              <Route
                path="/learning/:journeyId/:chapterId"
                element={<ChapterDetailPage />}
              />
              <Route
                path="/learning/:journeyId/:chapterId/:lessonSlug"
                element={<LessonDetailPage />}
              />

              {/* community */}
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/create-post" element={<CreatePost />} />
              <Route path="/community/project/:id" element={<PostDetails />} />
              <Route path="/community/edit/:id" element={<EditPost />} />

              {/* marketplace */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route
                path="/marketplace/sell"
                element={<MarketplacePostForm />}
              />
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
      </ThemeProvider>
    </AlertProvider>
  );
}

export default App;
