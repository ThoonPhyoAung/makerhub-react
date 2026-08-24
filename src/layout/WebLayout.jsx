import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const WebLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="flex-1">
        <Outlet /> {/* for child  */}
      </main>
      <Footer />
    </div>
  );
};

export default WebLayout;
