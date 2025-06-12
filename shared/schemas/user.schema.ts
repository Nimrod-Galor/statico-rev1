import { z } from "zod";
import { mongoIdValidation, passwordValidation } from "./helper.ts";

const baseSchema = z.object({
    email: z.string().email("Invalid email address"),  // Required email
    emailVerified: z.boolean().optional(),  // Optional email verification
    userName: z.string().min(3, "Username must be at least 3 characters long"),  // Required username
    roles: z.enum(['admin', 'author', 'contributor', 'editor', 'subscriber']).or(mongoIdValidation).array().min(1, "At least one role is required"),  // Required roles, can be an array of role names or MongoDB IDs
})

export const userSchema = baseSchema.extend({
    password: passwordValidation,
    rePassword: z.string(),
}).refine( data => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"], // path of error
})

const optionalPasswordValidation = z.preprocess(
    (val) => val === "" ? undefined : val, // treat "" as undefined
    passwordValidation.optional() // apply password rules only if defined
  );

export const userUpdateSchema = baseSchema.partial().extend({
    password: optionalPasswordValidation,
    rePassword: z.string().optional(),
}).refine(data => {
    // Only check for match if a password is provided
    if (data.password !== undefined) {
        return data.password === data.rePassword;
    }
    return true;
    }, {
    message: "Passwords don't match",
    path: ["rePassword"],
})

export type UserType = z.infer<typeof userSchema>
