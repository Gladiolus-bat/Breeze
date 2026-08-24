import { useState } from "react";
import { registerHotel } from "../../api/hotels";
import { useAuth } from "../../context/AuthContext";
import { useNav } from "../../context/NavContext";

const FIELDS = ["name", "address", "contact", "city"];

const BecomeHostPage = () => {
    const { token, refreshUser } = useAuth();
    const { navigate } = useNav();
    const [form, setForm] = useState({ name: "", address: "", contact: "", city: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await registerHotel(form, token);
            await refreshUser();
            navigate("ownerDashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="bg-neutral rounded-2xl shadow-sm p-8 flex flex-col gap-4">
                <h1 className="text-2xl font-playfair text-primary">List your hotel</h1>
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                {FIELDS.map((field) => (
                    <label key={field} className="flex flex-col gap-1 text-sm text-gray-700 capitalize">
                        {field}
                        <input
                            type="text"
                            name={field}
                            required
                            value={form[field]}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                    </label>
                ))}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50">
                    {submitting ? "Registering..." : "Register Hotel"}
                </button>
            </form>
        </div>
    );
};

export default BecomeHostPage;
