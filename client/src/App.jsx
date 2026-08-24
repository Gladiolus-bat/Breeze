import { useAuth } from "./context/AuthContext";
import {useNav} from "./context/NavContext";
import Navbar from "./components/layout/Navbar";
import AuthPage from "./components/auth/AuthPage";

const App = () => {
  const {isAuthenticated, loading} = useAuth();
  const {view} = useNav();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (view.name === "auth" && !isAuthenticated) {
    return <AuthPage/>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-tertiary px-4">
      <h1 className="text-2xl font-playfair text-primary">
        Welcome, {user.username || user.email}
      </h1>
      <p className="text-gray-600">Role: {user.role}</p>
      <button
      onClick={logout}
      className="bg-primary text-white rounded-lg px-4 py-2 hover:opacity-90 transition">
        Log Out
      </button>
    </div>
  );
};

export default App;