import {useState} from "react";

export function useGetMe(authUseCase) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getMe = async (token) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const result = await authUseCase.getMe(token);

            if (result.role !== "ADMIN") {
                localStorage.removeItem("token");
                setError("You don't have permission to use this action!");
                return null;
            }

            setSuccess("Login successful");
            localStorage.setItem("user", JSON.stringify(result));
            console.log(result);
            console.log(result.fullname);

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