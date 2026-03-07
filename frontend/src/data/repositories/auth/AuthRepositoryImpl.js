import {AuthRepository} from "../../../domain/repositories/auth/AuthRepository.js";
import {LoginResponseDto} from "../../dto/auth/login/response/LoginResponseDto.js";
import {LoginRequestDto} from "../../dto/auth/login/request/LoginRequestDto.js";
import {AuthToken} from "../../../domain/entity/auth/AuthToken.js";

export class AuthRepositoryImpl extends AuthRepository {

    async login(email, password) {

        const requestDto = new LoginRequestDto(email , password);

        const response = await fetch("http://localhost:8081/auth/login" ,  {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestDto)
        })

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Login failed");
        }

        const responseDto = LoginResponseDto.fromJson(json);

        return new AuthToken(responseDto.token);
    }

}