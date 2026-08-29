import { useAuth } from "../../context/AuthContext";
import { useNav } from "../../context/NavContext";

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { navigate } = useNav();

    return (
        <header className="bg-neutral border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate("home")}
                    className="text-xl font-playfair text-primary font-semibold">
                    Breeze
                </button>

                <nav className="flex items-center gap-4 text-sm">
                    <button
                        onClick={() => navigate("rooms")}
                        className="text-gray-700 hover:text-primary transition">
                        Rooms
                    </button>

                    {isAuthenticated && (
                        <button
                            onClick={() => navigate("myBookings")}
                            className="text-gray-700 hover:text-primary transition">
                            My Bookings
                        </button>
                    )}

                    {isAuthenticated && user?.role === "admin" && (
                        <button
                            onClick={() => navigate("ownerDashboard")}
                            className="text-gray-700 hover:text-primary transition">
                            Owner Dashboard
                        </button>
                    )}

                    {isAuthenticated && user?.role !== "admin" && (
                        <button
                            onClick={() => navigate("becomeHost")}
                            className="text-gray-700 hover:text-primary transition">
                            List Your Hotel
                        </button>
                    )}

                    {isAuthenticated && (
                        <button
                            onClick={() => navigate("profile")}
                            className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0"
                            title="Profile">
                            {user?.image ? (
                                <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                    {user?.username?.[0]?.toUpperCase() || "?"}
                                </span>
                            )}
                        </button>
                    )}

                    {isAuthenticated ? (
                        <button
                            onClick={logout}
                            className="bg-primary text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition">
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("auth")}
                            className="bg-primary text-white rounded-lg px-3 py-1.5 hover:opacity-90 transition">
                            Log in
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;