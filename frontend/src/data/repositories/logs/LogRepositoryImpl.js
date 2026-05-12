export class LogRepositoryImpl {
    #base = "http://localhost:8081";

    #headers() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
    }

    async getAllLogs() {
        const response = await fetch(`${this.#base}/logs`, {
            method: "GET",
            headers: this.#headers(),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to fetch logs");
        }

        return json;
    }

    async getMyLogs() {
        const response = await fetch(`${this.#base}/logs/my`, {
            method: "GET",
            headers: this.#headers(),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to fetch my logs");
        }

        return json;
    }
}