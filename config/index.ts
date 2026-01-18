import axios from "axios"

export const configs = {
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET
}

export const endPoint = axios.create({
    url: process.env.BASE_URL as string,
    timeout: 10000,
})

const getTokenJwt = () => {
    
}

export const headEndpoint = axios.create({
    url: process.env.BASE_URL as string,
    headers: {
        "Authorization": `bearer ${getTokenJwt}`
    }
})