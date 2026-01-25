import { TMetaData } from "@/app/components/model/type";
import { handler, THandler } from "@/class/handler";
import { TLogin } from "@/schema/auth";
import { CreateUserInput, Users } from "@/schema/users";
import { Category, CategoryBooking, Product } from "@prisma/client";
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
}

export const apiService = new ApiService()

