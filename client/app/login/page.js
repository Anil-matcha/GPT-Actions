'use client'
import Image from 'next/image'
import { useState,useEffect } from "react"
import axios from "axios"

function Login() {
    useEffect(()=>{
        axios.get("/api/login",{params:{id:localStorage.getItem('authID'), url:window.location.href}}).then((res)=>{
            window.location.href = localStorage.getItem('redirectTo')
        }).catch((err)=>{
        console.log(err)
        })
    },[])
    return (
        <main className="flex min-h-screen w-full flex-col gap-3 items-start justify-start p-4 py-8 md:p-24 bg-slate-200">
            <Image priority height={80} width={80} src='/logo.svg'/>
            <div>
            <h4 className="mb-1 text-5xl font-semibold">Logging you in ...</h4>
            </div>
          
    
        </main>
    );
}

export default Login;
