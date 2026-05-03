export class ShiftUseCase {

    constructor(shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    async getAllShifts() {
        return await this.shiftRepository.getAllShifts();
    }

     async getMyShifts() {
        return await this.shiftRepository.getMyShifts();
    }

    async getShiftById(shiftId) {
        return await this.shiftRepository.getShiftById(shiftId);
    }

    async createShift(shiftData) {
        return await this.shiftRepository.createShift(shiftData);
    }

    async updateShift(shiftId, shiftData) {
        return await this.shiftRepository.updateShift(shiftId, shiftData);
    }

    async deleteShift(shiftId) {
        return await this.shiftRepository.deleteShift(shiftId);
    }
}