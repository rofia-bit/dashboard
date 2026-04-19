import {AuthRepository} from "../../../domain/repositories/auth/AuthRepository.js";
import {LoginResponseDto} from "../../dto/auth/login/response/LoginResponseDto.js";
import {LoginRequestDto} from "../../dto/auth/login/request/LoginRequestDto.js";
import {AuthToken} from "../../../domain/entity/auth/AuthToken.js";
import {User} from "../../../domain/entity/user/User.js";

export class AuthRepositoryImpl extends AuthRepository {

    async login(email, password) {

        const requestDto = new LoginRequestDto(email , password);
        const response = await fetch("https://schnapps-statue-shallot.ngrok-free.dev/auth/login" ,  {
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


    async getMe(token) {

        const response = await fetch("https://schnapps-statue-shallot.ngrok-free.dev/auth/me" , {
            method: "GET" ,
            headers :{
                "Content-Type": "application/json" ,
                "Authorization": `Bearer ${token}`
            } ,
        })

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Login failed");
        }

        const me = User.fromJson(json) ;

        return me;
    }
}