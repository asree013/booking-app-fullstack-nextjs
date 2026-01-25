// hooks/useAuthHook.ts
'use client'
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'

export const useAuthHook = () => {
    const [user, setUser] = useState({ jwt: "", first_name: "", last_name: "", role: "" })
    const [isLoad, setIsLoad] = useState(true)

    useEffect(() => {
        console.log("useAuthHook");
        
        const userData = localStorage.getItem('userData')
        if (userData) {
            setUser(JSON.parse(userData))
        }
        setIsLoad(false)
    }, [])

    const onLogout = () => {
        Cookies.remove('jwt')
        localStorage.clear()
        window.location.href = '/page/login'
    }

    return { user, isLoad, onLogout }
}