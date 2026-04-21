export class LogRepositoryImpl {

    #base = "https://schnapps-statue-shallot.ngrok-free.dev/";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getLogs() {
        const response = await fetch(`${this.#base}/logs`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch logs");
        return json;
    }

    async createLog(personFullName, userRole, logState) {
        const response = await fetch(`${this.#base}/logs/create`, {
            method: "POST",
            headers: this.#headers(),
            body: JSON.stringify({ personFullName, userRole, logState }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to create log");
        return json;
    }
}