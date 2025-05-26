import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import { useAuth } from "../context/AuthProvider"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
  rememberMe: z.boolean()
})

type FormFields = z.infer<typeof schema>

function LoginPage() {
    const auth = useAuth()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            auth.handleLogin(data)
        } catch (error: any) {
            console.log("err")
            setError("root", {
                message: error.message || "Login Error",
            })
        }
    }

    return (
            <div className="flex flex-col justify-center px-6 py-10 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                
                

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    {errors.root && <div className="text-red-700 text-center mb-3">{errors.root.message}</div>}

                    <form action="#" method="POST" className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-5">
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>

                            <div className="mt-2">
                                <input {...register("email")} type="text" placeholder="Email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>

                            {errors.email && (
                                <div className="text-red-500 mb-3">{errors.email.message}</div>
                            )}
                        </div>

                        
                        <div className="mb-5">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            
                            <div className="mt-2">
                                <input {...register("password")}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                            </div>

                            {errors.password && (
                                <div className="text-red-500 mb-3">{errors.password.message}</div>
                            )}
                        </div>

                        <div className="flex items-center justify-between my-5">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input {...register("rememberMe")} id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 text-blue-600 hover:underline dark:text-primary-500">
                                Forgot password?
                            </Link>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                {isSubmitting ? "Loading..." : "Sign in"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <Link to="#" className="font-semibold text-blue-600 hover:text-indigo-500">
                            Sign up.
                        </Link>
                    </p>
                </div>
            </div>

    );
}

export default LoginPage