import { useEffect, useMemo, useState } from "react";
import { getRooms } from "../../api/rooms";
import { useNav } from "../../context/NavContext";
import RoomCard from "../rooms/RoomCard";

const RoomsPage = () => {
    const { navigate } = useNav();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        getRooms()
            .then((data) => setRooms(data.rooms))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filteredRooms = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return rooms;
        return rooms.filter((room) =>
            [room.roomType, room.hotel?.city, room.hotel?.name]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(term))
        );
    }, [rooms, search]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-2xl font-playfair text-primary">Available Rooms</h1>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by city, hotel, or room type"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            {loading && <p className="text-gray-500">Loading rooms...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && filteredRooms.length === 0 && (
                <p className="text-gray-500">No rooms match your search.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                    <RoomCard
                        key={room._id}
                        room={room}
                        onView={() => navigate("roomDetail", { roomId: room._id })} />
                ))}
            </div>
        </div>
    );
};

export default RoomsPage;
