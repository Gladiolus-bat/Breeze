import { useState } from "react";
import {useAuth} from "../../context/AuthContext";

const RegisterForm = ({onSwitchToLogin}) => {
    const {register} = useAuth();
    const [form, setForm] = useState({username: "", email: "", password: ""});
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (form.password.length < 8) {
            setError ("Password must be at least 8 characters long");
            return;
        }

        setSubmitting(true);
        try {
            await register(form);
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

        </form>
    );
};

export default RegisterForm;