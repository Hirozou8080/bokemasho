"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Regist = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // XSRF-TOKENをリクエスト時に送信するための設定
  const http = axios.create({
    baseURL: 'http://127.0.0.2:8080',
    withCredentials: true,
  });

  const postData = async () => {
    axios.get('http://127.0.0.2:8080/sanctum/csrf-cookie',
     { withCredentials: true })
     .then((res: any) => {
        // 登録処理
        http.post('/api/user/regist', {email, password}).then((res: any) => {
            console.log(res);
        })
    });
}
  return (
    <div>
      <input
          type="text"
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
          placeholder='email'
          onChange={(e) => {
            console.log(e.target.value);
            // setEmail(e.target.value);
          }}
          /><br/>
       <input
          type="text"
          className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm'
          placeholder='password'
          onChange={(e) => {
            console.log(e.target.value);
            //  setPassword(e.target.value);
          }}
          />
          <div>
          <button
                    className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
                    onClick={()=>{
                      console.log("登録");
                        // postData();
                    }}
                >登録</button>
          </div>
    </div>
  )
}

export default Regist