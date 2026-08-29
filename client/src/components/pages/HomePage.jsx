import { useEffect, useState } from "react";
import { useNav } from "../../context/NavContext";
import { getRooms } from "../../api/rooms";
import RoomCard from "../rooms/RoomCard";
import heroImage from "../../assets/hero.svg";

const HomePage = () => {
  const { navigate } = useNav();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms()
      .then((data) => setRooms(data.rooms.slice(0, 3)))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section
        className="relative px-4 py-28 text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative">
          <h1 className="text-4xl font-playfair text-primary mb-4">
            Find your next stay
          </h1>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            Comfortable rooms, honest prices, booked in a couple of clicks.
          </p>
          <button
            onClick={() => navigate("rooms")}
            className="bg-primary text-white rounded-lg px-6 py-3 font-medium hover:opacity-90 transition">
            Browse Rooms
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-playfair text-primary mb-6">Featured Rooms</h2>
        {loading ? (
          <p className="text-gray-500">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-500">No rooms available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onView={() => navigate("roomDetail", { roomId: room._id })}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
