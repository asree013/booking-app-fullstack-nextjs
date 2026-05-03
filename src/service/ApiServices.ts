import { TMetaData } from "@/app/components/model/type";
import { handler, THandler } from "@/class/handler";
import { TLogin } from "@/schema/auth";
import { CreateUserInput, Users } from "@/schema/users";
import { Category, CategoryBooking, Product, Rooms } from "@prisma/client";
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
            if (result.data.data && result.data.data.jwt) {
                const userData = result.data.data;
                const user = {
                    jwt: userData.jwt,
                    first_name: userData.user.first_name,
                    last_name: userData.user.last_name,
                }
                Cookies.set('jwt', userData.jwt, { expires: 7, path: '/', secure: process.env.NODE_ENV === 'production' })
                localStorage.setItem('userData', JSON.stringify(user))
                // ให้ LoginPage เป็นคนจัดการ redirect เพื่อให้แสดง Toast ได้
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

    async getCategoryProduct(): Promise<THandler<Category[]>> {
        try {
            const result = await endPoint.get<TMetaData<Category[]>>('/api/category/product')
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([] as Category[], new Error(error.response?.data.message), 400)
            }
            return handler([] as Category[], new Error(error.message as any), 500)
        }
    }

    async createCategoryBooking(data: CategoryBooking): Promise<THandler<CategoryBooking>> {
        try {
            const result = await endPoint.post<TMetaData<CategoryBooking>>('/api/category/booking', data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as CategoryBooking, new Error(error.response?.data.message), 400)
            }
            return handler({} as CategoryBooking, new Error(error.message as any), 500)
        }
    }

    async createCategoryProduct(data: Category): Promise<THandler<Category>> {
        try {
            const result = await endPoint.post<TMetaData<Category>>('/api/category/product', data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Category, new Error(error.response?.data.message), 400)
            }
            return handler({} as Category, new Error(error.message as any), 500)
        }
    }

    async getCategoryBooking(): Promise<THandler<CategoryBooking[]>> {
        try {
            const result = await endPoint.get<TMetaData<Category[]>>('/api/category/booking')
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([] as Category[], new Error(error.response?.data.message), 400)
            }
            return handler([] as Category[], new Error(error.message as any), 500)
        }
    }

    async uploadImage(file: File): Promise<TMetaData<{ image: string }>> {
        const formData = new FormData()
        formData.append('file', file)
        try {
            const response = await endPoint.post('/api/uploads/image', formData, {
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    console.log(`Upload progress: ${percentCompleted}%`);
                },
            });
            return {
                data: {
                    image: response.data.data,
                },
                message: response.data.message,
            } as TMetaData<{ image: string }>
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return {
                    data: {
                        image: ""
                    },
                    message: error.response?.data.message,
                } as TMetaData<{ image: string }>
            }
            return {
                data: {
                    image: ""
                },
                message: error.message,
            } as TMetaData<{ image: string }>
        }
    }

    async createProduct(data: Product): Promise<THandler<Product>> {
        try {
            const result = await endPoint.post<TMetaData<Product>>(`/api/product`, data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Product, new Error(error.response?.data.message), 400)
            }
            return handler({} as Product, new Error(error.message as any), 500)
        }
    }

    async getProduct(): Promise<THandler<Product[]>> {
        try {
            const result = await endPoint.get<TMetaData<Product[]>>(`/api/product`)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([] as Product[], new Error(error.response?.data.message), 400)
            }
            return handler([] as Product[], new Error(error.message as any), 500)
        }
    }

    async getProductByProductId(id: string): Promise<THandler<Product>> {
        try {
            const result = await endPoint.get<TMetaData<Product>>(`/api/product/${id}`)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Product, new Error(error.response?.data.message), 400)
            }
            return handler({} as Product, new Error(error.message as any), 500)
        }
    }

    async updateProductByProductId(id: string, data: Product): Promise<THandler<Product>> {
        try {
            const result = await endPoint.put<TMetaData<Product>>(`/api/product/${id}`, data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Product, new Error(error.response?.data.message), 400)
            }
            return handler({} as Product, new Error(error.message as any), 500)
        }
    }

    async createRoom(data: Rooms): Promise<THandler<Rooms>> {
        try {
            const result = await endPoint.post<TMetaData<Rooms>>(`/api/room`, data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, new Error(error.response?.data.message), 400)
            }
            return handler({} as Rooms, new Error(error.message as any), 500)
        }
    }

    async getRoom(): Promise<THandler<Rooms[]>> {
        try {
            const result = await endPoint.get<TMetaData<Rooms[]>>(`/api/room`)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([] as Rooms[], new Error(error.response?.data.message), 400)
            }
            return handler([] as Rooms[], new Error(error.message as any), 500)
        }
    }

    async getRoomByProductId(productId: string): Promise<THandler<Rooms[]>> {
        try {
            const result = await endPoint.get<TMetaData<Rooms[]>>(`/api/room/product/${productId}`)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler([] as Rooms[], new Error(error.response?.data.message), 400)
            }
            return handler([] as Rooms[], new Error(error.message as any), 500)
        }
    }

    async getRoomByRoomId(id: string): Promise<THandler<Rooms>> {
        try {
            const result = await endPoint.get<TMetaData<Rooms>>(`/api/room/${id}`)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, new Error(error.response?.data.message), 400)
            }
            return handler({} as Rooms, new Error(error.message as any), 500)
        }
    }

    async updateRoomByRoomId(id: string, data: Rooms): Promise<THandler<Rooms>> {
        try {
            const result = await endPoint.put<TMetaData<Rooms>>(`/api/room/${id}`, data)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, new Error(error.response?.data.message), 400)
            }
            return handler({} as Rooms, new Error(error.message as any), 500)
        }
    }
    async deleteRoomByRoomId(id: string): Promise<THandler<Rooms>> {
        try {
            const result = await endPoint.delete<TMetaData<Rooms>>(`/api/room/${id}`)
            return handler(result.data.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({} as Rooms, new Error(error.response?.data.message), 400)
            }
            return handler({} as Rooms, new Error(error.message as any), 500)
        }
    }

    async logout(): Promise<THandler<any>> {
        try {
            const result = await endPoint.get('/api/auth/sign-out')
            Cookies.remove('jwt')
            localStorage.removeItem('userData')
            return handler(result.data, undefined, 200)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                return handler({}, new Error(error.response?.data.message), 400)
            }
            return handler({}, new Error(error.message as any), 500)
        }
    }
}

export const apiService = new ApiService()

