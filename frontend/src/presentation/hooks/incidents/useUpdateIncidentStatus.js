import { useState } from "react";

export function useUpdateIncidentStatus(incidentUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateStatus = async (incidentId, status) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await incidentUseCase.updateIncidentStatus(incidentId, status);
            return updated;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateStatus, loading, error };
}