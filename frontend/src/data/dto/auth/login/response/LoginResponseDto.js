export class LoginResponseDto {
    constructor(token) {
        this.token = token;
    }

    static fromJson(json) {
        return new LoginResponseDto(json.token);
    }
}