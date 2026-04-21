import { useState } from "react";

export function usePatchReport(reportUseCase) {
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);
    const [success, setSuccess] = useState(false);

    const patchReport = async (reportId, adminResponse) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const result = await reportUseCase.patchReport(reportId, adminResponse);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { patchReport, loading, error, success };
}