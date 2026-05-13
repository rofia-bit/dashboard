import { useState } from "react";

export function useCreateAndAssignShift(shiftUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createAndAssignShift = async (data) => {
        setLoading(true);
        setError(null);

        try {
            return await shiftUseCase.createAndAssignShift(data);
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createAndAssignShift, loading, error };
}