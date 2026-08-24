import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
    const [mode, setMode] = useState("login");
    const [prefillEmail, setPrefillEmail] = useState("");
    const [notice, setNotice] = useState("");

    const switchToRegister = () => {
        setNotice("");
        setMode("register");
    }

    const switchToLogin = () => {
        setNotice("");
        setMode("login");
    }

    const handleRegisterSuccess = (email) => {
        setPrefillEmail(email);
        setNotice("Account created - log in to continue.");
        setMode("login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-tertiary px-4">
            {mode === "login" ? (
                <LoginForm onSwitchToRegister={switchToRegister}
                    initialEmail={prefillEmail}
                    notice={notice} />
            ) : (
                <RegisterForm onSwitchToLogin={switchToLogin}
                    onRegisterSuccess={handleRegisterSuccess} />
            )}
        </div>
    );
};

export default AuthPage;