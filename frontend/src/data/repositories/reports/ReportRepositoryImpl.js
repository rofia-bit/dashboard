export class ReportRepositoryImpl {

    #base = "https://schnapps-statue-shallot.ngrok-free.dev";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getAllReports() {
        const response = await fetch(`${this.#base}/reports`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch reports");
        return json;
    }

    async getReportById(reportId) {
        const response = await fetch(`${this.#base}/reports/${reportId}`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch report");
        return json;
    }

    async patchReport(reportId, adminResponse) {
        const response = await fetch(`${this.#base}/reports/${reportId}`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify({ adminResponse }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to update report");
        return json;
    }

    async deleteReport(reportId) {
        const response = await fetch(`${this.#base}/reports/${reportId}`, {
            method: "DELETE",
            headers: this.#headers(),
        });
        if (!response.ok) {
            const json = await response.json().catch(() => ({}));
            throw new Error(json.message || "Failed to delete report");
        }
        return true;
    }
}