export class ShiftRepositoryImpl {

    #base = "https://schnapps-statue-shallot.ngrok-free.dev";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getAllShifts() {
        const response = await fetch(`${this.#base}/shift`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch shifts");
        return json;
    }

    async getShiftById(shiftId) {
        const response = await fetch(`${this.#base}/shift/${shiftId}`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch shift");
        return json;
    }

    async createShift(shiftData) {
        const response = await fetch(`${this.#base}/shift`, {
            method: "POST",
            headers: this.#headers(),
            body: JSON.stringify(shiftData),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to create shift");
        return json;
    }

    async updateShift(shiftId, shiftData) {
        const response = await fetch(`${this.#base}/shift/${shiftId}`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify(shiftData),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to update shift");
        return json;
    }

    async deleteShift(shiftId) {
        const response = await fetch(`${this.#base}/shift/${shiftId}`, {
            method: "DELETE",
            headers: this.#headers(),
        });
        if (!response.ok) throw new Error("Failed to delete shift");
        return true;
    }
}