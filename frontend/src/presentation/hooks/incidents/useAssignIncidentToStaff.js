import { useState } from "react";

export function useAssignIncidentToStaff(incidentUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const assignIncident = async (incidentId, staffId) => {
        try {
            setLoading(true);
            setError(null);

            const result = await incidentUseCase.assignIncidentToStaff(incidentId, staffId);
            return result;
        } catch (err) {
            console.error("Assign incident error:", err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { assignIncident, loading, error };
}