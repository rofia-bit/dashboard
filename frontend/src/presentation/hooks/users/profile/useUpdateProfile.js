import { useState } from "react";

export function useUpdateProfile(userUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);
    const [success, setSuccess] = useState(false);

    const updateProfile = async (fullname, email) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const result = await userUseCase.updateProfile(fullname, email);
            // keep localStorage in sync
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...stored, fullname, email }));
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error, success };
}