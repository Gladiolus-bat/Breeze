import { useEffect, useState } from "react";
import { getUserBookings } from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";

const formatDate = (d) => new Date(d).toLocaleDateString();

const statusStyles = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
};

const MyBookingsPage = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getUserBookings(token)
            .then((data) => setBookings(data.bookings))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-playfair text-primary mb-6">My Bookings</h1>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && bookings.length === 0 && (
                <p className="text-gray-500">No bookings yet.</p>
            )}

            <div className="flex flex-col gap-4">
                {bookings.map((b) => (
                    <div
                        key={b._id}
                        className="bg-neutral rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="h-20 w-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {b.room?.images?.[0] && (
                                <img
                                    src={b.room.images[0]}
                                    alt={b.room.roomType}
                                    className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-playfair text-primary">{b.room?.roomType}</h3>
                            <p className="text-sm text-gray-600">
                                {b.hotel?.name}, {b.hotel?.city}
                            </p>
                            <p className="text-sm text-gray-500">
                                {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)} · {b.guests} guest
                                {b.guests > 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-primary">${b.totalPrice}</p>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${statusStyles[b.status] || statusStyles.pending}`}>
                                {b.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookingsPage;
