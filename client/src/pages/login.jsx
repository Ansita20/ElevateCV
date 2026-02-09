import { Lock, Mail, User2Icon } from 'lucide-react';
import React from 'react';

const Login = () => {

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  

    const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

    }

   return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

    {/* Soft Backdrop */}
    <div className="fixed inset-0 -z-10 pointer-events-none bg-black">
      <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[60rem] h-[28rem] bg-gradient-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
      <div className="absolute right-12 bottom-10 w-[26rem] h-[14rem] bg-gradient-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
    </div>

    {/* Centered Card */}
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[350px] text-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-8"
    >
      <h1 className="text-white text-3xl mt-10 font-medium">
        {state === "login" ? "Login" : "Sign up"}
      </h1>

      <p className="text-[#b0b0b0] text-sm mt-2">
        Please sign in to continue
      </p>

      {state !== "login" && (
        <div className="flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full pl-6 gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full bg-transparent text-white placeholder-white/60 outline-none"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full pl-6 gap-2">
        <input
          type="email"
          name="email"
          placeholder="Email id"
          className="w-full bg-transparent text-white placeholder-white/60 outline-none"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full pl-6 gap-2">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full bg-transparent text-white placeholder-white/60 outline-none"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mt-4 text-left">
        <button className="text-sm text-indigo-400 hover:underline">
          Forget password?
        </button>
      </div>

      <button
        type="submit"
        className="mt-4 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition"
      >
        {state === "login" ? "Login" : "Sign up"}
      </button>

      <p
        onClick={() =>
          setState(prev => (prev === "login" ? "register" : "login"))
        }
        className="text-[#b0b0b0] text-sm mt-3 mb-10 cursor-pointer"
      >
        {state === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <span className="text-indigo-400 hover:underline ml-1">
          click here
        </span>
      </p>
    </form>
  </div>
);

}

export default Login;