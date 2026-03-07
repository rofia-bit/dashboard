import {User} from "../../entity/user/User.js";

export class AuthUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async login(email, password) {
        return await this.authRepository.login(email, password);
    }

    async getMe(token) {
        return await this.authRepository.getMe(token);
    }
}