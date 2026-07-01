import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';

export default function Login(){
    const[email, setEmail]= useState('');
    const[password, setPassword]= useState('');
    const[error, setError]= useState('');
    const navigate= useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        setError('');

        try{
            const response= await fetch('http://localhost:5001/api/auth/login', {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email,password}),
            });
           const data= await response.json();
        
            if(!response.ok) {
                throw new Error(data.message|| 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));


            alert(`Welcome back, ${data.user.name} !`);
            navigate('/dashboard');
        }
        catch(error){
            setError(error.message);
        }
    }
        return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md">
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
          Sign in to Warehouse App
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            create a new operator account
          </Link>
        </p>
      </div>
<div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg font-medium">
               {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                className="mt-1 w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      </div>
      );
    };
