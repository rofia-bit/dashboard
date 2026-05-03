import { useState } from "react";

export function useCreateFacility(facilityUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const createFacility = async (facilityData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await facilityUseCase.createFacility(facilityData);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createFacility, loading, error };
}