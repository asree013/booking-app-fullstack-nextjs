import { RepoRoom } from "@/repositorys/RepoRoom";
import { prisma } from "lib/db";

export class RoomService extends RepoRoom {

    getRoomByProductId = async (productId: string) => {
        return await prisma.rooms.findMany({
            where: {
                productId: productId
            }
        })
    }
}