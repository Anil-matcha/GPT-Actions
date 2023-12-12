'use client'
import Image from 'next/image'
import { useState,useEffect } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation";

export default function Home({params:{slug}}) {
  const [authUrl,setAuthUrl] = useState("")
  const [user,setUser] = useState({email:'',password:''})
  const searchParams = useSearchParams()
  useEffect(()=>{
    localStorage.setItem('authID',slug)
    if(searchParams.get("myRedirect")!=null){
      localStorage.setItem('redirectTo',searchParams.get("myRedirect"))
    }else{
      var redirect_uri = searchParams.get('redirect_uri')
      redirect_uri += "?state="+searchParams.get('state')+"&code="+searchParams.get('client_id')
      localStorage.setItem('redirectTo',redirect_uri)
    }
    axios.get("/api/get_login_url",{params:{id:slug}}).then((res)=>{
      setAuthUrl(res.data)
    }).catch((err)=>{
    console.log(err)
    })
  },[])
  return (
    <main className="flex min-h-screen w-full flex-col gap-3 items-start justify-start p-4 py-8 md:p-24 bg-slate-200">
      <Image priority height={80} width={80} src='/logo.svg'/>
      <div>
        <h4 className="mb-1 text-5xl">Welcome to <b>GPTAuth</b></h4>
        <span>Login to continue</span>
      </div>
      <div className=" w-20 h-[1px] my-4 bg-black"/>
      <button className="flex items-center justify-center py-4 bg-slate-700 px-4 py-3 text-white" onClick={()=>window.location.href=authUrl}>
        <Image width={20} height={20} src='/google-logo.svg' className=" me-2 p-1 bg-slate-50 rounded-full"/>
        Login with Google
      </button>

    </main>
  )
}
