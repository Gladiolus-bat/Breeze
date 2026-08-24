import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
    const { register } = useAuth();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setSubmitting(true);
        try {
            await register(form);
            onRegisterSuccess(form.email);
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-4 bg-neutral p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-playfair text-primary">Create Your Account</h2>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <label className="flex flex-col gap-1 text-sm text-gray-700">
                Username:
                <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="jane_doe"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-700">
                Email
                <input type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-700">
                Password
                <input
                    type="password"
                    name="password"
                    requiredminLength={8}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>

            <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-sm text-gray-600 text-center">
                Already have an account? {""}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-primary font-medium hover:underline">
                    Log in
                </button>
            </p>
        </form>
    );
};

export default RegisterForm;
