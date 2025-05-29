import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { roleSchema } from "../../../shared/schemas/role.schema.ts"
import type { RoleInput } from "../../../shared/schemas/role.schema.ts"


import type { DefaultValues } from 'react-hook-form'; 
import type { FormField } from '../models/formSchemas'
import type { FieldValues } from 'react-hook-form'



// const roleSchema = z.object({
//     id: z.string()
//         .refine((id: string) => /^[a-fA-F0-9]{24}$/.test(id), {
//             message: "Invalid Id",
//         }).optional(),
//     name: z.string()
//         .min(3, "Role must be at least 3 characters long")
//         .optional(),
//     description: z.string()
//         .min(3, "Description must be at least 3 characters long")
//         .optional()
// })

// type RoleInput = z.infer<typeof roleSchema>


type DynamicFormProps<T> = {
  formfieldsSchema: FormField[];
  validationSchema: any;
  defaultValues?: DefaultValues<T>;
}

function DynamicForm<T>({ formfieldsSchema, validationSchema, defaultValues }: DynamicFormProps<T>) {

// type FormType = z.infer<typeof roleSchema>


    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleInput>({
    resolver: zodResolver(roleSchema),
    defaultValues
  });


// interface OnSubmitData extends FieldValues {}

// interface OnSubmitProps extends FieldValues {}

interface OnSubmitData extends FieldValues {}

const onSubmit: (data: OnSubmitData) => void = (data) => {
    console.log("Form submitted:", data);
};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-2">
            <label>Name:</label>
            <input type="text" className="border-gray-600 border-2" {...register("name" as any)} />
            {errors.name && <p>{(errors.name as any)?.message}</p>}

        </div>

        <div className="m-2">
            <label>Description:</label>
            <input type="text" className="border-gray-600 border-2" {...register("description" as any)} />
            {errors.description && <p>{(errors.description as any)?.message}</p>}
        </div>

        <button type="submit">Submit</button>
    </form>
  )
}

export default DynamicForm