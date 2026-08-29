import { useEffect, useState } from "react";
import { getOwnerRooms, updateRoom } from "../../api/rooms";
import { useAuth } from "../../context/AuthContext";
import { useNav } from "../../context/NavContext";

const EditRoomForm = ({ roomId }) => {
    const { token } = useAuth();
    const { navigate } = useNav();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [form, setForm] = useState({ roomType: "", pricePerNight: "", services: "" });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getOwnerRooms(token)
            .then((data) => {
                const room = data.rooms.find((r) => r._id === roomId);
                if (!room) {
                    setLoadError("Room not found.");
                    return;
                }
                setForm({
                    roomType: room.roomType,
                    pricePerNight: room.pricePerNight,
                    services: (room.services || []).join(", "),
                });
                setExistingImages(room.images || []);
            })
            .catch((err) => setLoadError(err.message))
            .finally(() => setLoading(false));
    }, [roomId, token]);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFiles = (e) => setNewImages(Array.from(e.target.files).slice(0, 4));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("roomType", form.roomType);
        formData.append("pricePerNight", form.pricePerNight);
        formData.append("services", form.services);
        newImages.forEach((file) => formData.append("images", file));

        setSubmitting(true);
        try {
            await updateRoom(roomId, formData, token);
            setSuccess("Room updated.");
            setTimeout(() => navigate("ownerDashboard"), 800);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-gray-500 px-4 py-10">Loading room...</p>;
    if (loadError) return <p className="text-red-600 px-4 py-10">{loadError}</p>;

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <button
                onClick={() => navigate("ownerDashboard")}
                className="text-sm text-primary hover:underline mb-4"
            >
                ← Back to dashboard
            </button>

            <form
                onSubmit={handleSubmit}
                className="bg-neutral rounded-2xl shadow-sm p-6 flex flex-col gap-4"
            >
                <h1 className="text-xl font-playfair text-primary">Edit Room</h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        {success}
                    </p>
                )}

                <label className="flex flex-col gap-1 text-sm text-gray-700">
                    Room type
                    <input
                        type="text"
                        name="roomType"
                        required
                        value={form.roomType}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm text-gray-700">
                    Price per night
                    <input
                        type="number"
                        name="pricePerNight"
                        min="0"
                        required
                        value={form.pricePerNight}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm text-gray-700">
                    Services (comma separated)
                    <input
                        type="text"
                        name="services"
                        value={form.services}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </label>

                {existingImages.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-700 mb-2">Current images</p>
                        <div className="grid grid-cols-4 gap-2">
                            {existingImages.map((img, i) => (
                                <img key={i} src={img} alt="" className="h-16 w-full object-cover rounded-lg" />
                            ))}
                        </div>
                    </div>
                )}

                <label className="flex flex-col gap-1 text-sm text-gray-700">
                    Replace images (optional, up to 4 — leave empty to keep the current ones)
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFiles}
                        className="border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-primary"
                    />
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default EditRoomForm;
