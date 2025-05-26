import {z} from 'zod'

import { passwordValidation } from './helper'

export const loginSchema = z.object({
    email: z.string()
        .email("Invalid email address"),
    password: passwordValidation
})

export type LoginInput = z.infer<typeof loginSchema>