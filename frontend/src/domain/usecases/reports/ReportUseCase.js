export class ReportUseCase {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }

    async getAllReports() {
        return await this.reportRepository.getAllReports();
    }

    async getReportById(reportId) {
        return await this.reportRepository.getReportById(reportId);
    }

    async patchReport(reportId, adminResponse) {
        return await this.reportRepository.patchReport(reportId, adminResponse);
    }

    async deleteReport(reportId) {
        return await this.reportRepository.deleteReport(reportId);
    }
}