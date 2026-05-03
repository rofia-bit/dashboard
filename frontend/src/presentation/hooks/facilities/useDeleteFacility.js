import { useState } from "react";

export function useDeleteFacility(facilityUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const deleteFacility = async (facilityId) => {
        setLoading(true);
        setError(null);
        try {
            await facilityUseCase.deleteFacility(facilityId);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteFacility, loading, error };
}