import {useState} from "react";
import { useNavigate } from "react-router-dom";

export function useGetMe(authUseCase) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const ALLOWED_ROLES = ["ADMIN", "SECURITY_GUARD"];

    const getMe = async (token) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const result = await authUseCase.getMe(token);

            if (!ALLOWED_ROLES.includes(result.role)) {
                localStorage.removeItem("token");
                setError("You don't have permission to use this action!");
                return null;
            }

            setSuccess("Login successful");
            localStorage.setItem("user", JSON.stringify(result));

            if (result.role === "ADMIN") {
                navigate("/dashboard");
            } else if (result.role === "SECURITY_GUARD") {
                navigate("/guard");
            }

            return result;

        } catch (err) {
            setError(err.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        getMe,
        loading,
        error,
        success,
    };


}