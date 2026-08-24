import { Routes, Route } from "react-router-dom";

import WebLayout from "./layout/WebLayout";
import Home from "./pages/home/Home";
import Learning from "./pages/learning/Learning";
import JourneyDetail from "./pages/learning/JourneyDetail";
import LessonDetail from "./pages/learning/LessonDetail";
import Community from "./pages/community/Community";
import Marketplace from "./pages/marketplace/Marketplace";
import CreatePost from "./pages/community/CreatePost";

function App() {
  return (
    <div>
      <Routes>
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
  );
}

export default App;
