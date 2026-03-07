export class AuthUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async login(email, password) {
        return await this.authRepository.login(email, password);
    }


}