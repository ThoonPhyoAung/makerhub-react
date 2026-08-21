import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Learning from "./pages/Learning";
import JourneyDetail from "./pages/JourneyDetail";
import LessonDetail from "./pages/LessonDetail";
import Community from "./pages/Community";
import Marketplace from "./pages/Marketplace";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/:journeyId" element={<JourneyDetail />} />
        <Route
          path="/learning/:journeyId/:lessonSlug"
          element={<LessonDetail />}
        />
        <Route path="/community" element={<Community />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
