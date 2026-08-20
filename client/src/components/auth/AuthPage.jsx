import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
    const [mode, setMode] = useState("login");

    return (
        <div className="min-h-screen flex items-center justify-center bg-tertiary px-4">
            {mode === "login" ? (
                <LoginForm onSwitchToRegister={() => setMode("register")}/>
            ) : (
                <RegisterForm onSwitchToLogin={() => setMode("login")}/>
            )}
        </div>
    );
};

export default AuthPage;