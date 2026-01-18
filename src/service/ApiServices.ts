import { handler, THandler } from "@/class/handler";
import { TLogin } from "@/schema/auth";
import { CreateUserInput, Users } from "@/schema/users";
import axios from "axios";
import { endPoint } from "config";
import Cookies from 'js-cookie'

type TUser = {
    data: { data: Users, jwt: string }
}

class ApiService {
    async login(data: TLogin) {
        try {
            const result = await endPoint.post('/api/auth/login', data)
            if (result.data.jwt) {
                const user = {
                    jwt: result.data.jwt,
                    first_name: result.data.first_name,
                    last_name: result.data.last_name,
                }
                Cookies.set('jwt', result.data.jwt, { expires: 7 }) 
                localStorage.setItem('userData', JSON.stringify(user))
                window.location.href = '/page/dashboard'
            }
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as TUser, new Error(error.response?.data.message), 400)
            }
            return handler({} as TUser, new Error(error.message as any), 500)
        }
    }

    async verifyToken(jwt: string) {
        try {
            const result = await endPoint.get(`/api/auth/verify?jwt=${jwt}`)
            return handler(result.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler(error.response?.data.message, undefined, 400)
            }
            return handler(new Error(error.message), undefined, 500)
        }
    }

    async getUsers(): Promise<THandler<Users[]>> {
        try {
            const result = await endPoint.get('/api/user')
            return handler(result.data.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([] as Users[], new Error(error.response?.data.message), 400)
            }
            return handler([] as Users[], new Error(error.message as any), 500)
        }
    }

    async createUser(data: CreateUserInput) {
        try {
            const result = await endPoint.post(`/api/auth/register`, data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([] as Users[], new Error(error.response?.data.message), 400)
            }
            return handler([] as Users[], new Error(error.message as any), 500)
        }
    }

    async editUser(id: string, data: CreateUserInput): Promise<THandler<Users>> {
        try {
            const result = await endPoint.put(`/api/user/${id}`, data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Users, new Error(error.response?.data.message), 400)
            }
            return handler({} as Users, new Error(error.message as any), 500)
        }
    }
}

export const apiService = new ApiService()

