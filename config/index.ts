import axios from "axios"

export const configs = {
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET
}

/**
 * Browser (Client-side): ใช้ relative URL เพื่อให้ Browser resolve ต่อท้าย domain ปัจจุบันได้เอง
 *   → dev: http://localhost:3000/api/...
 *   → production: https://booking.yeedev.asia/api/...
 *
 * Server-side (Next.js API route): ใช้ absolute URL เพราะ Node.js ไม่รู้จัก relative URL
 */
const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        // Client-side: ใช้ relative URL ไม่ต้องมี base domain
        return ''
    }
    // Server-side: ใช้ localhost เพราะ API route อยู่ใน container เดียวกัน
    return process.env.BASE_URL || 'http://localhost:3000'
}

export const endPoint = axios.create({
    baseURL: getBaseURL(),
    timeout: (1_000 * 60) * 2,
})

const getTokenJwt = () => {

}

export const headEndpoint = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Authorization": `bearer ${getTokenJwt}`
    }
})