import { useAuth } from "../../context/AuthContext";
import { useNav } from "../../context/NavContext";
import { assets } from "../../assets/assets";

const Footer = () => {
    const { isAuthenticated, user } = useAuth();
    const { navigate } = useNav();

    return (
        <footer className="bg-neutral border-t border-gray-200 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                    <button onClick={() => navigate("home")} className="flex items-center gap-2 mb-3">
                        <img src={assets.logo} alt="Breeze" className="h-8 w-auto" />
                    </button>
                    <p className="text-sm text-gray-500 max-w-xs">
                        Comfortable rooms, honest prices, booked in a couple of clicks.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-primary mb-3">Quick Links</h3>
                    <ul className="flex flex-col gap-2 text-sm text-gray-600">
                        <li>
                            <button onClick={() => navigate("home")} className="hover:text-primary transition">
                                Home
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("rooms")} className="hover:text-primary transition">
                                Rooms
                            </button>
                        </li>
                        {isAuthenticated && (
                            <li>
                                <button onClick={() => navigate("myBookings")} className="hover:text-primary transition">
                                    My Bookings
                                </button>
                            </li>
                        )}
                        {isAuthenticated && user?.role === "admin" ? (
                            <li>
                                <button onClick={() => navigate("ownerDashboard")} className="hover:text-primary transition">
                                    Owner Dashboard
                                </button>
                            </li>
                        ) : isAuthenticated ? (
                            <li>
                                <button onClick={() => navigate("becomeHost")} className="hover:text-primary transition">
                                    List Your Hotel
                                </button>
                            </li>
                        ) : null}
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-primary mb-3">Account</h3>
                    <ul className="flex flex-col gap-2 text-sm text-gray-600">
                        {isAuthenticated ? (
                            <li>
                                <button onClick={() => navigate("profile")} className="hover:text-primary transition">
                                    Profile
                                </button>
                            </li>
                        ) : (
                            <li>
                                <button onClick={() => navigate("auth")} className="hover:text-primary transition">
                                    Log in / Sign up
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} Breeze. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
