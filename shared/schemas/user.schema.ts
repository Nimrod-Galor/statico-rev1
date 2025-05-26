import { z } from "zod";

import { mongoIdValidation, passwordValidation } from "./helper";


export const userSchema = z.object({
    id: mongoIdValidation
        .optional(),  // Optional MongoDB ID
    email: z.string()
        .email("Invalid email address"),  // Required email
        // .refine(async (email, id) => {
        //     return await userExists(email, id)
        // }, {
        //     message: "An account with that email address already exists"
        // }),
    emailVerified: z.boolean()
        .optional(),  // Optional email verification
    password: passwordValidation,
    rePassword: z.string(),
                // .refine(pass => )
    userName: z.string()
        .min(3, "Username must be at least 3 characters long"),  // Required username
    // role: z.string()
    //     .optional()
    //     .refine(async (role) => {
    //             if (!role){
    //                 return true  // Role is optional, so skip check if not provided
    //             }
    //             return await roleExistsInDb(role)// Validate against DB
    //         }, {
    //         message: "Invalid role, does not exist in the database",
    //     }),
    role: z.enum(['admin', 'author', 'contributor', 'editor', 'subscriber']), //'admin', 'author', 'contributor', 'editor', 'subscriber'
}).refine( data => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"], // path of error
  })

export type UserInput = z.infer<typeof userSchema>