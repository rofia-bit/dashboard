export class ShiftRepositoryImpl {

    #base = "https://schnapps-statue-shallot.ngrok-free.dev";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getMyShifts() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;
    
    const response = await fetch(`${this.#base}/assignedShift/me?userId=${userId}`, {
        method: "GET",
        headers: this.#headers(),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || "Failed to fetch shifts");
    return json;
}
}