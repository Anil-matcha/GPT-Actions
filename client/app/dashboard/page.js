'use client'
import Image from 'next/image'
import { useState,useEffect } from "react"
import axios from "axios"

function Dashboard() {
    const [created,setCreated] = useState(false)
    const [credentials,setCredentials] = useState({adminId:'',id:'',secret:''})
    const [URLs,setURLs] = useState({auth:'',token:''})
    const [googleCreds,setGoogleCreds] = useState({id:'',secret:''})
    const [fullUrl, setFullUrl] = useState('');
    const createCredentials = () => {
        if(googleCreds.id==""||googleCreds.secret==""){
            alert('Enter Google Credentials!')
        }else{
            axios.post("/api/get_credentials",{googleId:googleCreds.id,googleSecret:googleCreds.secret}).then((res)=>{
            setCredentials({adminId:res.data.adminId,id:res.data.id,secret:res.data.secret})
            setCreated(true)
            localStorage.setItem('authID',res.data.adminId)
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
    const copyCredential = (cred) => {
        navigator.clipboard.writeText(cred)
    }

    useEffect(() => {
        // This code runs on the client-side
        const url = window.location.protocol + "//" + window.location.host + "/login";
        setFullUrl(url);
    }, []);

    const handleButtonClick = () => {
        // Ensure this function also safely accesses `window`
        if (typeof window !== 'undefined') {
            copyCredential(window.location.host + "/login");
        }
    };
 
    useEffect(()=>{
        if(credentials.adminId!=""){
            setURLs({auth:window.location.protocol + "//" + window.location.host + "/oauth/"+credentials.adminId,token:window.location.protocol + "//" + window.location.host + "/api/verify_token/"+credentials.adminId})
        }
    },[credentials])
    useEffect(()=>{
        if(localStorage.getItem('authID')!=null){
            axios.post("/api/get_credentials",{id:localStorage.getItem('authID')}).then((res)=>{
                setCredentials({adminId:res.data.adminId,id:res.data.id,secret:res.data.secret})
                setCreated(true)
            }).catch((err)=>{
            console.log(err)
            })
        }
    },[])
    return (
        <main className="flex min-h-screen w-full flex-col gap-3 items-start justify-start p-4 py-8 md:p-24 bg-slate-200">
            <Image priority height={80} width={80} src='/logo.svg'/>
            <div>
            <h4 className="mb-1 text-5xl">Welcome to <b>GPTAuth</b></h4>
            <span>Create your unique credentials to use in your GPT, using your <a className=" italic underline" href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Oauth app details</a></span>
            </div>
            <div className="md:w-1/2 w-full">
                <label htmlFor="name" className="block mb-1 text-sm font-medium ">Add this redirect URI to your app</label>
                <div className="flex gap-2">
                    <input 
                        id="name" 
                        className="bg-gray-50 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        disabled 
                        value={fullUrl} 
                    />
                    <button 
                        onClick={handleButtonClick} 
                        className="flex items-center justify-center py-4 bg-slate-700 px-3 py-2 text-white"
                    >
                        <Image height={20} width={20} src="/copy.svg" />
                    </button>
                </div>
            </div>
            <div className=" w-20 h-[1px] my-4 bg-black"/>
            {created==false?
                <>
                    <div className="md:w-1/2 w-full">
                        <label htmlFor="id" className="block mb-1 text-sm font-medium ">Enter Google Client ID</label>
                        <div className="flex gap-2">
                            <input  id="id" className="bg-gray-50 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " value={googleCreds.id} onChange={(e)=>setGoogleCreds({id:e.target.value,secret:googleCreds.secret})}/>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <label htmlFor="secret" className="block mb-1 text-sm font-medium ">Enter Google Client Secret</label>
                        <div className="flex gap-2">
                            <input  id="secret" type="password" className="bg-gray-50 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " value={googleCreds.secret} onChange={(e)=>setGoogleCreds({secret:e.target.value,id:googleCreds.id})}/>
                        </div>
                    </div>
                    <button className="flex items-center justify-center py-4 bg-slate-700 px-4 py-3 text-white gap-2" onClick={createCredentials}>
                        <b>+</b>
                        Create credentials
                    </button>
                </>
            :
                <>
                    <div className="md:w-1/2 w-full">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium ">Client ID</label>
                        <div className="flex gap-2">
                            <input  id="name" className="bg-gray-50 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " disabled value={credentials.id} />
                            <button onClick={()=>copyCredential(credentials.id)} className="flex items-center justify-center py-4 bg-slate-700 px-3 py-2 text-white">
                                <Image height={20} width={20} src="/copy.svg" />
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium ">Client Secret</label>
                        <div className="flex gap-2">
                            <input  id="name" className="bg-gray-50 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " disabled value={credentials.secret} />
                            <button onClick={()=>copyCredential(credentials.secret)} className="flex items-center justify-center py-4 bg-slate-700 px-3 py-2 text-white">
                                <Image height={20} width={20} src="/copy.svg" />
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium ">Oauth URL</label>
                        <div className="flex gap-2">
                            <input  id="name" className="bg-gray-50 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " disabled value={URLs.auth} />
                            <button onClick={()=>copyCredential(URLs.auth)} className="flex items-center justify-center py-4 bg-slate-700 px-3 py-2 text-white">
                                <Image height={20} width={20} src="/copy.svg" />
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <label htmlFor="name" className="block mb-1 text-sm font-medium ">Token URL</label>
                        <div className="flex gap-2">
                            <input  id="name" className="bg-gray-50 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " disabled value={URLs.token} />
                            <button onClick={()=>copyCredential(URLs.token)} className="flex items-center justify-center py-4 bg-slate-700 px-3 py-2 text-white">
                                <Image height={20} width={20} src="/copy.svg" />
                            </button>
                        </div>
                    </div>
                </>
            }
        </main>
    );
}

export default Dashboard;
