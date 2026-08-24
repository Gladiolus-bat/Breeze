import { useState } from "react";
import AddRoomForm from "./AddRoomForm";
import ManageRooms from "./ManageRoom";
import HotelBookings from "./HotelBooking";

const TABS = [
    { id: "manageRooms", label: "Manage Rooms" },
    { id: "addRoom", label: "Add Room" },
    { id: "bookings", label: "Bookings" },
];

const OwnerDashboard = () => {
    const [tab, setTab] = useState("manageRooms");

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-playfair text-primary mb-6">Owner Dashboard</h1>

            <div className="flex gap-2 mb-8 border-b border-gray-200">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t.id
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-primary"
                            }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "manageRooms" && <ManageRooms />}
            {tab === "addRoom" && <AddRoomForm />}
            {tab === "bookings" && <HotelBookings />}
        </div>
    );
};

export default OwnerDashboard;
