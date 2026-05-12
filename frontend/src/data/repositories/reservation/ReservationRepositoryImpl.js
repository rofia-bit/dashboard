export class ReservationRepositoryImpl {
    #base = "http://localhost:8081";

    #headers() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
    }

    async getAllReservations() {
        const response = await fetch(`${this.#base}/reservations`, {
            method: "GET",
            headers: this.#headers(),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to fetch reservations");
        }

        return json;
    }

    async getReservationById(reservationId) {
        const response = await fetch(`${this.#base}/reservations/${reservationId}`, {
            method: "GET",
            headers: this.#headers(),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to fetch reservation");
        }

        return json;
    }

    async updateReservationStatus(reservationId, status) {
        const response = await fetch(`${this.#base}/reservations/${reservationId}/status`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            let message = "Failed to update reservation status";

            try {
                const json = await response.json();
                message = json.message || message;
            } catch (_) {}

            throw new Error(message);
        }

        try {
            return await response.json();
        } catch (_) {
            return true;
        }
    }

    async deleteReservation(reservationId, userId) {
        const response = await fetch(
            `${this.#base}/reservations/${reservationId}?userId=${encodeURIComponent(userId)}`,
            {
                method: "DELETE",
                headers: this.#headers(),
            }
        );

        if (!response.ok) {
            let message = "Failed to delete reservation";

            try {
                const json = await response.json();
                message = json.message || message;
            } catch (_) {}

            throw new Error(message);
        }

        return true;
    }
}