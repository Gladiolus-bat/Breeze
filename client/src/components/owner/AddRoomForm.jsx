import { useState } from "react";
import { createRoom } from "../../api/rooms";
import { useAuth } from "../../context/AuthContext";

const AddRoomForm = () => {
    const { token } = useAuth();
    const [form, setForm] = useState({ roomType: "", pricePerNight: "", services: "" });
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFiles = (e) => setImages(Array.from(e.target.files).slice(0, 4));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (images.length === 0) {
            setError("Add at least one room image.");
            return;
        }

        const formData = new FormData();
        formData.append("roomType", form.roomType);
        formData.append("pricePerNight", form.pricePerNight);
        formData.append("services", form.services);
        images.forEach((file) => formData.append("images", file));

        setSubmitting(true);
        try {
            await createRoom(formData, token);
            setSuccess("Room added.");
            setForm({ roomType: "", pricePerNight: "", services: "" });
            setImages([]);
            e.target.reset();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-neutral rounded-2xl shadow-sm p-6 flex flex-col gap-4 max-w-lg">
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
                    placeholder="Deluxe Double"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
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
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-700">
                Services (comma separated)
                <input
                    type="text"
                    name="services"
                    value={form.services}
                    onChange={handleChange}
                    placeholder="Free WiFi, Breakfast, AC"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-700">
                Images (up to 4)
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-primary" />
            </label>

            <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "Adding..." : "Add Room"}
            </button>
        </form>
    );
};

export default AddRoomForm;
