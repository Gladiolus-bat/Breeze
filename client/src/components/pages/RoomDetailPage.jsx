import { useEffect, useState } from "react";
import { getRooms } from "../../api/rooms";
import { checkAvailability, createBooking } from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";
import { useNav } from "../../context/NavContext";

const RoomDetailPage = ({ roomId }) => {
    const { token, isAuthenticated } = useAuth();
    const { navigate } = useNav();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [availability, setAvailability] = useState(null); // null | true | false
    const [checking, setChecking] = useState(false);
    const [booking, setBooking] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");

    useEffect(() => {
        getRooms()
            .then((data) => {
                const found = data.rooms.find((r) => r._id === roomId);
                setRoom(found || null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [roomId]);

    const handleCheckAvailability = async () => {
        setBookingError("");
        setBookingSuccess("");
        if (!checkInDate || !checkOutDate) {
            setBookingError("Pick both check-in and check-out dates.");
            return;
        }
        setChecking(true);
        try {
            const data = await checkAvailability({ roomId, checkInDate, checkOutDate });
            setAvailability(data.isAvailable);
        } catch (err) {
            setBookingError(err.message);
        } finally {
            setChecking(false);
        }
    };

    const handleBook = async () => {
        if (!isAuthenticated) {
            navigate("auth");
            return;
        }
        setBookingError("");
        setBooking(true);
        try {
            await createBooking({ roomId, checkInDate, checkOutDate, guests: Number(guests) }, token);
            setBookingSuccess("Booking confirmed! Check My Bookings for details.");
            setAvailability(null);
        } catch (err) {
            setBookingError(err.message);
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <p className="text-center py-16 text-gray-500">Loading room...</p>;
    if (error) return <p className="text-center py-16 text-red-600">{error}</p>;
    if (!room) return <p className="text-center py-16 text-gray-500">Room not found.</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
                <div className="h-72 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                    {room.images?.[0] ? (
                        <img src={room.images[0]} alt={room.roomType} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                        </div>
                    )}
                </div>
                {room.images?.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {room.images.slice(1, 5).map((img, i) => (
                            <img key={i} src={img} alt="" className="h-16 w-full object-cover rounded-lg" />
                        ))}
                    </div>
                )}

                <h1 className="text-2xl font-playfair text-primary mt-6">{room.roomType}</h1>
                <p className="text-gray-600">
                    {room.hotel?.name} — {room.hotel?.address}, {room.hotel?.city}
                </p>
                {room.services?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {room.services.map((s) => (
                            <li key={s} className="text-xs bg-secondary text-primary rounded-full px-3 py-1">
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
                <p className="text-xl font-semibold text-primary mt-6">
                    ${room.pricePerNight} <span className="text-sm text-gray-500 font-normal">/ night</span>
                </p>
            </div>

            <div className="bg-neutral rounded-2xl shadow-sm p-6 h-fit">
                <h2 className="text-lg font-playfair text-primary mb-4">Book this room</h2>

                {bookingError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                        {bookingError}
                    </p>
                )}
                {bookingSuccess && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">
                        {bookingSuccess}
                    </p>
                )}

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                        Check-in
                        <input
                            type="date"
                            value={checkInDate}
                            onChange={(e) => {
                                setCheckInDate(e.target.value);
                                setAvailability(null);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                        Check-out
                        <input
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => {
                                setCheckOutDate(e.target.value);
                                setAvailability(null);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                        Guests
                        <input
                            type="number"
                            min="1"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={handleCheckAvailability}
                        disabled={checking}
                        className="border border-primary text-primary rounded-lg py-2 font-medium hover:bg-secondary transition disabled:opacity-50">
                        {checking ? "Checking..." : "Check Availability"}
                    </button>

                    {availability === true && (
                        <p className="text-sm text-green-700">Room is available for those dates.</p>
                    )}
                    {availability === false && (
                        <p className="text-sm text-red-600">Room is not available for those dates.</p>
                    )}

                    <button
                        type="button"
                        onClick={handleBook}
                        disabled={booking || availability !== true}
                        className="bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50">
                        {booking ? "Booking..." : isAuthenticated ? "Book Now" : "Log in to Book"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailPage;
