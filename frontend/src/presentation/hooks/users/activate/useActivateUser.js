import { useState } from "react";

export function useActivateUser(userUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const activateUser = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            await userUseCase.activateUser(userId);
            return true;
        } catch (err) {
            console.error("Activate user hook error:", err);
            setError(err.message || "Failed to activate user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        activateUser,
        loading,
        error,
    };
}