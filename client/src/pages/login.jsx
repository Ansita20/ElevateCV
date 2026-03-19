import { Lock, Mail, User2Icon } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import api from '../configs/api';
import { login, setLoading } from '../app/features/authSlice';

const Login = () => {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  

    const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })
    const [authDebug, setAuthDebug] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setAuthDebug(`Submitting ${state} request...`)
        try{
        const { data } = await api.post(`/api/users/${state}`, formData);
        if (data?.token && data?.user) {
          localStorage.setItem('token', data.token)
          dispatch(login({ token: data.token, user: data.user }))
          dispatch(setLoading(false))
          setAuthDebug('Success: token and user received. Redirecting to /app...')
          toast.success(data.message || 'Authentication successful')
          window.location.replace('/app')
          return
        }

        setAuthDebug('Auth response did not include token/user. Check backend response shape.')
        toast.error('Authentication succeeded but token was not returned')
        }catch(error) {
            const status = error?.response?.status
            const message = error?.response?.data?.message || error.message
            setAuthDebug(`Auth failed${status ? ` (${status})` : ''}: ${message}`)
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    React.useEffect(() => {
      if (user || localStorage.getItem('token')) {
        setAuthDebug('Existing session found. Redirecting to /app...')
        window.location.replace('/app')
      }
    }, [user])

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
        <button type="button" className="text-sm text-indigo-400 hover:underline">
          Forget password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition"
      >
        {isSubmitting ? 'Please wait...' : (state === "login" ? "Login" : "Sign up")}
      </button>

      {authDebug && (
        <p className="mt-3 text-xs text-left text-amber-300 break-words">{authDebug}</p>
      )}

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