import { useAuth } from "./context/AuthContext";
import { useNav } from "./context/NavContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthPage from "./components/auth/AuthPage";
import HomePage from "./components/pages/HomePage";
import RoomsPage from "./components/pages/RoomsPage";
import RoomDetailPage from "./components/pages/RoomDetailPage";
import MyBookingsPage from "./components/pages/MyBookingsPage";
import BecomeHostPage from "./components/pages/BecomeHostPage";
import ProfilePage from "./components/pages/ProfilePage";
import OwnerDashboard from "./components/owner/OwnerDashboard";
import EditRoomForm from "./components/owner/EditRoomForm";

const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const { view } = useNav();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (view.name === "auth" && !isAuthenticated) {
    return <AuthPage />;
  }

  const renderView = () => {
    switch (view.name) {
      case "rooms":
        return <RoomsPage />;
      case "roomDetail":
        return <RoomDetailPage roomId={view.roomId} />;
      case "myBookings":
        return isAuthenticated ? <MyBookingsPage /> : <AuthPage />;
      case "becomeHost":
        return isAuthenticated ? <BecomeHostPage /> : <AuthPage />;
      case "ownerDashboard":
        return isAuthenticated ? <OwnerDashboard /> : <AuthPage />;
      case "editRoom":
        return isAuthenticated ? <EditRoomForm roomId={view.roomId} /> : <AuthPage />;
      case "profile":
        return isAuthenticated ? <ProfilePage /> : <AuthPage />;
      case "home":
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-tertiary flex flex-col">
      <Navbar />
      <div className="flex-1">{renderView()}</div>
      <Footer />
    </div>
  );
};

export default App;
