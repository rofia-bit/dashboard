export class ShiftRepositoryImpl {
    #base = "http://localhost:8081";

    #headers() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
    }

    async getAllShifts() {
        const response = await fetch(`${this.#base}/shift`, {
            method: "GET",
            headers: this.#headers(),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to fetch shifts");
        }

        return json;
    }

    async createShift(data) {
        const response = await fetch(`${this.#base}/shift`, {
            method: "POST",
            headers: this.#headers(),
            body: JSON.stringify({
                onDate: data.onDate,
                startTime: data.startTime,
                endTime: data.endTime,
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to create shift");
        }

        return json; // { shiftId }
    }

    async updateShift(shiftId, data) {
        const response = await fetch(`${this.#base}/shift/${shiftId}`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify({
                onDate: data.onDate,
                startTime: data.startTime,
                endTime: data.endTime,
            }),
        });

        if (!response.ok) {
            let message = "Failed to update shift";

            try {
                const json = await response.json();
                message = json.message || message;
            } catch (_) {}

            throw new Error(message);
        }

        return true;
    }

    async deleteShift(shiftId) {
        const response = await fetch(`${this.#base}/shift/${shiftId}`, {
            method: "DELETE",
            headers: this.#headers(),
        });

        if (!response.ok) {
            throw new Error("Failed to delete shift");
        }

        return true;
    }

    async assignShift(userId, shiftId) {
        const response = await fetch(`${this.#base}/assignedShift`, {
            method: "POST",
            headers: this.#headers(),
            body: JSON.stringify({
                userId,
                shiftId,
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to assign shift");
        }

        return json; // { assignId }
    }

    async unassignShift(userId, shiftId) {
        const response = await fetch(`${this.#base}/assignedShift/${userId}/${shiftId}`, {
            method: "DELETE",
            headers: this.#headers(),
        });

        if (!response.ok) {
            throw new Error("Failed to unassign shift");
        }

        return true;
    }
}