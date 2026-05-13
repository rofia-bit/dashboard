export class ShiftUseCase {
    constructor(shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    async getAllShifts() {
        return await this.shiftRepository.getAllShifts();
    }

    async createShift(data) {
        return await this.shiftRepository.createShift(data);
    }

    async updateShift(shiftId, data) {
        return await this.shiftRepository.updateShift(shiftId, data);
    }

    async deleteShift(shiftId) {
        return await this.shiftRepository.deleteShift(shiftId);
    }

    async assignShift(userId, shiftId) {
        return await this.shiftRepository.assignShift(userId, shiftId);
    }

    async createAndAssignShift(data) {
        const createdShift = await this.createShift({
            onDate: data.onDate,
            startTime: data.startTime,
            endTime: data.endTime,
        });

        await this.assignShift(data.guardId, createdShift.shiftId);

        return createdShift;
    }
}