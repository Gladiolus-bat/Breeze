import { useEffect, useState } from "react";
import { getHotelBookings } from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";

const formatDate = (d) => new Date(d).toLocaleDateString();

const HotelBookings = () => {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getHotelBookings(token)
            .then((res) => setData(res.dashboardData))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!data) return null;

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
                <div className="bg-neutral rounded-2xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-playfair text-primary">{data.totalBookings}</p>
                </div>
                <div className="bg-neutral rounded-2xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-playfair text-primary">${data.totalRevenue}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {data.bookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
                {data.bookings.map((b) => (
                    <div
                        key={b._id}
                        className="bg-neutral rounded-2xl shadow-sm p-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-primary">{b.room?.roomType}</p>
                            <p className="text-sm text-gray-500">
                                {b.user?.username} · {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                            </p>
                        </div>
                        <p className="font-semibold text-primary">${b.totalPrice}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelBookings;
