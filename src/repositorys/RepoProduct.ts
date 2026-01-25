import { handler, THandler } from "@/class/handler";
import { IBaseService } from "@/class/IBaseServer";
import type { Product, Rooms } from "@prisma/client";

import { prisma } from "lib/db";

export class RepoProduct implements IBaseService<Product> {
  async findAll(): Promise<THandler<Product[]>> {
    try {
      const result = await prisma.product.findMany({
        include: {
          rooms: {
            select: {
              id: true,
              name: true,
              is_active: true
            }
          }
        }
      });
      return handler(result);
    } catch (error) {
      return handler([], error as Error);
    }
  }

  async findById(id: string): Promise<THandler<Product>> {
    try {
      const result = await prisma.product.findUnique({
        where: { id },
      });

      if (!result) {
        return handler(null as any, new Error("Product not found"));
      }

      return handler(result);
    } catch (error) {
      return handler(null as any, error as Error);
    }
  }

  async create(data: Product & { category: { id?: string }[] } & { rooms?: Rooms }): Promise<THandler<Product>> {
    try {
      const { category, rooms, ...productData } = data;

      const result = await prisma.product.create({
        data: {
          ...productData,
          // categorys: {
          //   connect: category.filter(c => c.id).map(c => ({ id: c.id }))
          // },
          // ...(rooms && rooms.name && {
          //   rooms: {
          //     create: {
          //       name: rooms.name,
          //       price: Number(rooms.price),
          //       is_active: rooms.is_active ?? false,
          //       image: rooms.image || null,
          //     }
          //   }
          // })
        }
      });

      return handler(result);
    } catch (error) {
      console.error(error);
      return handler(null as any, error as Error);
    }
  }

  async update(
    id: string,
    data: Partial<Product>
  ): Promise<THandler<Product>> {
    try {
      const result = await prisma.product.update({
        where: { id },
        data,
      });
      return handler(result);
    } catch (error) {
      return handler(null as any, error as Error);
    }
  }

  async delete(id: string): Promise<THandler<Product>> {
    try {
      const result = await prisma.product.delete({
        where: { id },
      });
      return handler(result);
    } catch (error) {
      return handler(null as any, error as Error);
    }
  }
}
