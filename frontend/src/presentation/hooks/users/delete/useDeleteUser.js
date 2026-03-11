import { useState } from "react";

export function useDeleteUser(userUseCase) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const deleteUser = async (userId) => {

        try {

            setLoading(true);
            setError("");

            await userUseCase.deleteUser(userId);

            return true;

        } catch (err) {

            setError(err.message || "Delete failed");
            return false;

        } finally {
            setLoading(false);
        }
    };

    return {
        deleteUser,
        loading,
        error
    };
}