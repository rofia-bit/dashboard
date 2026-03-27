import { useState } from "react";

export function useDeleteIncident(incidentUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteIncident = async (incidentId) => {
        setLoading(true);
        setError(null);
        try {
            await incidentUseCase.deleteIncident(incidentId);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteIncident, loading, error };
}