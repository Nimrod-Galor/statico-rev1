import { z } from "zod";
import { mongoIdValidation, passwordValidation } from "./helper.ts";

import { roleSchema as Role } from "./role.schema.ts"

export const userSchema = z.object({
        id: mongoIdValidation,
            // .optional(),  // Optional MongoDB ID
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
        userId: mongoIdValidation
            .optional(),  // Optional user ID, useful for editing existing users
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
        roles: Role.or(mongoIdValidation).array().min(1, "At least one role is required"),  // Required roles, can be an array of Role objects or MongoDB IDs
    }).refine( data => data.password === data.rePassword, {
        message: "Passwords don't match",
        path: ["rePassword"], // path of error
    })

export type UserInput = z.infer<typeof userSchema>

export const userEditSchema = z.object({
        id: mongoIdValidation,
            // .optional(),  // Optional MongoDB ID
        email: z.string()
            .email("Invalid email address"),
        emailVerified: z.boolean()
            .optional(),  // Optional email verification
        password: passwordValidation.optional().or(z.literal('')),
        rePassword: z.string(),
                    // .refine(pass => )
        userName: z.string()
            .min(3, "Username must be at least 3 characters long"),  // Required username
        roles: Role.or(mongoIdValidation).array().min(1, "At least one role is required"),  // Required roles, can be an array of Role objects or MongoDB IDs,
    }).refine( data => data.password === data.rePassword, {
        message: "Passwords don't match",
        path: ["rePassword"], // path of error
    })

export type UserEditInput = z.infer<typeof userEditSchema>