import { THandler } from "./handler"

export interface IBaseService<T> {
    findAll(): Promise<THandler<T[]>>
    findById(id: string): Promise<THandler<T>>
    create(data: T): Promise<THandler<T>>
    update(id: string, data: Partial<T>): Promise<THandler<T>>
    delete(id: string): Promise<THandler<T>> 
}