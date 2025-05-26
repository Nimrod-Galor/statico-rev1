import {z} from 'zod'
import validator from 'validator'

export const isMongoId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id)

export const passwordValidation = z.string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
    })
    .refine((val) => /[\W_]/.test(val), {
        message: "Password must contain at least one special character",
    })
    
export const mongoIdValidation = z.string()
    .refine(isMongoId, {
        message: "Invalid Id",
    })

export const slugValidation = z.string().refine((val) => validator.isSlug(val), {
        message: "Invalid slug format",
    })