import { z } from 'zod'
import { passwordValidation } from './helper.ts'

export const passwordSchema = z.object({
    password: passwordValidation
})