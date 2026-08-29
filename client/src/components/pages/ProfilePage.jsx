import { useState } from "react";
import { updateProfile, changePassword } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
    const { user, token, refreshUser } = useAuth();

    const [username, setUsername] = useState(user?.username || "");
    const [imageFile, setImageFile] = useState(null);
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);

    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");

        const formData = new FormData();
        formData.append("username", username);
        if (imageFile) formData.append("image", imageFile);

        setSavingProfile(true);
        try {
            await updateProfile(formData, token);
            await refreshUser();
            setProfileSuccess("Profile updated.");
            setImageFile(null);
        } catch (err) {
            setProfileError(err.message);
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwords.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters long.");
            return;
        }

        setSavingPassword(true);
        try {
            await changePassword(passwords, token);
            setPasswordSuccess("Password updated.");
            setPasswords({ currentPassword: "", newPassword: "" });
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
            <h1 className="text-2xl font-playfair text-primary">Profile</h1>

            <form
                onSubmit={handleProfileSubmit}
                className="bg-neutral rounded-2xl shadow-sm p-6 flex flex-col gap-4"
            >
                <h2 className="text-lg font-playfair text-primary">Profile Details</h2>

                {profileError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {profileError}
                    </p>
                )}
                {profileSuccess && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        {profileSuccess}
                    </p>
                )}

                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {user?.image && (
                            <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <label className="text-sm text-gray-700">
                        <span className="block mb-1">Profile picture</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0] || null)}
                            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-primary"
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-1 text-sm text-gray-700">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </label>

                <button
                    type="submit"
                    disabled={savingProfile}
                    className="self-start bg-primary text-white rounded-lg py-2 px-6 font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                    {savingProfile ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <form
                onSubmit={handlePasswordSubmit}
                className="bg-neutral rounded-2xl shadow-sm p-6 flex flex-col gap-4"
            >
                <h2 className="text-lg font-playfair text-primary">Change Password</h2>

                {passwordError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {passwordError}
                    </p>
                )}
                {passwordSuccess && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        {passwordSuccess}
                    </p>
                )}

                <label className="flex flex-col gap-1 text-sm text-gray-700">
                    Current password
                    <input
                        type="password"
                        required
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm text-gray-700">
                    New password
                    <input
                        type="password"
                        required
                        minLength={8}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </label>

                <button
                    type="submit"
                    disabled={savingPassword}
                    className="self-start bg-primary text-white rounded-lg py-2 px-6 font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                    {savingPassword ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
