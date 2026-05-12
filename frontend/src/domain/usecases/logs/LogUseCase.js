export class LogUseCase {

    constructor(logRepository) {
        this.logRepository = logRepository;
    }

    async getAllLogs() {
        return await this.logRepository.getAllLogs();
    }

    async getMyLogs() {
        return await this.logRepository.getMyLogs();
    }
}