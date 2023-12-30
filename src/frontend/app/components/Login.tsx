"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const postData = async () => {
        axios.get('http://127.0.0.2:8080/sanctum/csrf-cookie').then((res: any) => {
            console.log(res);
        });
    }

    return (
        <div>
            <input
                type="text"
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
                placeholder='email'
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            /><br/>
            <input
                type="text"
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
                placeholder='password'
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <div>
                <button
                    className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
                    onClick={()=>{
                        postData();
                    }}
                >送信</button>
            </div>
        </div>
    );
}

export default Login;
