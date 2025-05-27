import { useState } from "react"
import { BsEye, BsEyeSlash } from "react-icons/bs"
import type { InputHTMLAttributes } from "react"

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
    placeholder?: string;
}

function PasswordInput({ placeholder = "Enter your password", ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="relative">
            <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                {...props}
            />
            <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className="absolute right-0 top-0 h-full w-8 bg-gray-300 rounded-tr-md rounded-br-md  hover:text-gray-700 hover:cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <BsEyeSlash className="w-full text-center" /> : <BsEye className="w-full text-center" />}
            </button>
        </div>
    )
}

export default PasswordInput