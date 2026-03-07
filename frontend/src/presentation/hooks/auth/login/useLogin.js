import { useState } from "react";

export function useLogin(authUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const result = await authUseCase.login(email, password);

            localStorage.setItem("token", result.token);
            setSuccess("Login successful");
            console.log(result);

            return result;
        } catch (err) {
            setError(err.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        loading,
        error,
        success,
    };
}