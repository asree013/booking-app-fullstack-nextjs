import { BookingService } from "./booking";
import { CategoryBookingService, CategoryProductService, CategoryRoomService } from "./category";
import { ProductService } from "./product";
import { RoomService } from "./room";
import { UserServices } from "./user";
import { Utils } from "./util";

export const Services = {
    productService: new ProductService(),
    userService: new UserServices(),
    utils: new Utils(),
    categoryBooking: new CategoryBookingService(),
    categoryProduct: new CategoryProductService(),
    categoryRoom: new CategoryRoomService(),
    booking: new BookingService(),
    room: new RoomService(),
}