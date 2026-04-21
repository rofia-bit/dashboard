export class LogUseCase {

    constructor(logRepository) {
        this.logRepository = logRepository;
    }

    async getLogs() {
        return await this.logRepository.getLogs();
    }

    async createLog(personFullName, userRole, logState) {
        return await this.logRepository.createLog(personFullName, userRole, logState);
    }
}