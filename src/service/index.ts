import { CategoryBookingService, CategoryProductService } from "./category";
import { ProductService } from "./product";
import { UserServices } from "./user";
import { Utils } from "./util";

export const Services = {
    productService: new ProductService(),
    userService: new UserServices(),
    utils: new Utils(),
    categoryBooking: new CategoryBookingService(),
    categoryProduct: new CategoryProductService()
}