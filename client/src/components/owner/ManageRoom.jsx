import { useEffect, useState } from "react";
import { getOwnerRooms, toggleRoomAvailability } from "../../api/rooms";
import { useAuth } from "../../context/AuthContext";

const ManageRooms = () => {
    const { token } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        getOwnerRooms(token)
            .then((data) => setRooms(data.rooms))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    const handleToggle = async (roomId) => {
        setTogglingId(roomId);
        try {
            await toggleRoomAvailability(roomId, token);
            setRooms((prev) =>
                prev.map((r) => (r._id === roomId ? { ...r, isAvailable: !r.isAvailable } : r))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setTogglingId(null);
        }
    };

    if (loading) return <p className="text-gray-500">Loading rooms...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (rooms.length === 0)
        return <p className="text-gray-500">No rooms yet — add one from the Add Room tab.</p>;

    return (
        <div className="flex flex-col gap-4">
            {rooms.map((room) => (
                <div key={room._id} className="bg-neutral rounded-2xl shadow-sm p-4 flex items-center gap-4">
                    <div className="h-16 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {room.images?.[0] && (
                            <img src={room.images[0]} alt={room.roomType} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-playfair text-primary">{room.roomType}</h3>
                        <p className="text-sm text-gray-500">${room.pricePerNight} / night</p>
                    </div>
                    <button
                        onClick={() => handleToggle(room._id)}
                        disabled={togglingId === room._id}
                        className={`text-sm rounded-lg px-3 py-1.5 transition disabled:opacity-50 ${room.isAvailable ? "bg-secondary text-primary" : "bg-gray-200 text-gray-600"
                            }`}>
                        {togglingId === room._id ? "..." : room.isAvailable ? "Available" : "Unavailable"}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ManageRooms;
