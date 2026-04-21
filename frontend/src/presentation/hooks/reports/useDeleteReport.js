import { useState } from "react";

export function useDeleteReport(reportUseCase) {
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    const deleteReport = async (reportId) => {
        setLoading(true);
        setError(null);
        try {
            await reportUseCase.deleteReport(reportId);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteReport, loading, error };
}