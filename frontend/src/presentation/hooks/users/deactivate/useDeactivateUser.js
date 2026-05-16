import { useState } from "react";

export function useDeactivateUser(userUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deactivateUser = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const result = await userUseCase.deactivateUser(userId);
            return !!result;
        } catch (err) {
            console.error("Deactivate user hook error:", err);
            setError(err.message || "Failed to deactivate user");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deactivateUser,
        loading,
        error,
    };
}