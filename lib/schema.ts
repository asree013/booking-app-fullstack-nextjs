// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
  
}

model Users {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  first_name  String
  last_name   String
  age         String?
  tell        String?
  address     String?
  role        Roles    @default(USER)
  create_date DateTime @default(now())
  update_date DateTime @updatedAt
}

enum Roles {
  ADMIN
  MANAGER
  CLIENT
  GUEST
  USER
}

model Bookings {
  id    String  @id @default(uuid())
  rooms Rooms[]
}

model Product {
  id          String            @id @default(uuid())
  name        String
  detail      String?
  image       String?
  price       String?
  create_date DateTime          @default(now())
  update_date DateTime          @updatedAt
  rooms       Rooms[]
  categorys   CategoryBooking[]
}

model Rooms {
  id          String    @id @default(uuid())
  is_active   Boolean   @default(false)
  image       String?
  name        String
  price       Int
  room_id     String
  products    Product   @relation(fields: [room_id], references: [id])
  create_date DateTime  @default(now())
  update_date DateTime  @updatedAt
  booking_id  String
  bookings    Bookings? @relation(fields: [booking_id], references: [id])
}

model CategoryBooking {
  id          String   @id @default(uuid())
  name        String   @unique
  detail      String?
  image       String?
  category_id String
  products    Product  @relation(fields: [category_id], references: [id])
  create_date DateTime @default(now())
  update_date DateTime @updatedAt
}
