import { useState } from "react";

export function useLogin(authUseCase) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (email, password) => {

        try {

            setLoading(true);
            setError("");

            const result = await authUseCase.login(email, password);

            console.log(result);
            localStorage.setItem("token", result.token);

            return result.token;

        } catch (err) {

            setError(err.message || "Login failed");
            return null;

        } finally {

            setLoading(false);

        }

    };

    return { login, loading, error };
}