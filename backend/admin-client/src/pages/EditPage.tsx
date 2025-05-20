
import { schemas } from "../schemas";
import { z } from 'zod'
import { useParams, useNavigate } from 'react-router-dom'
import DynamicForm from '../components/DynamicForm';
import { useQuery } from "@tanstack/react-query";
import { getItem, updateItem, createItem } from "../api";
import toast from 'react-hot-toast';

import type { SubmitHandler } from "react-hook-form";

function EditPage() {
    let navigate = useNavigate();
    const { activeCategory = 'role', operation = 'create', id } = useParams();

    const schema = schemas[activeCategory as keyof typeof schemas]
    // get type from schema
    type FormFields = z.infer<typeof schema>;

    // if operation 'edit' get item values for the form default values
    const query = useQuery({
        queryKey: ['get-item', {activeCategory, operation, id}],
        queryFn: () => getItem(activeCategory, id),
        select(data) { return data.data },
        enabled: operation == 'edit'
    })

    // set form default values
    const defaultValues = query.data || {}

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // console.log('submit:', data)
        try{
        if(operation == 'edit'){
                await updateItem(activeCategory, query.data.id, data)
                navigate(`/admin/${activeCategory}`)
                toast.success(`${activeCategory} Updated.`)
            }else{
                await createItem(activeCategory, data)
                navigate(`/admin/${activeCategory}`)
                toast.success(`${activeCategory} Created.`)
            }
        }catch(err){
            console.log('onsubmit')
            throw err
        }
    }

    // Loading
    if(query.isLoading){
        return(<div>Loading...</div>)
    }

    // Error
    if(query.isError){
        const error = query.error as { response?: { data?: { message?: string } }, message: string };
        const errorMessage = error.response?.data?.message || error.message;
        return(<div className="text-red-600 text-center">{errorMessage}</div>)
    }

    // Form
    return (
        <div className="grid grid-flow-col justify-items-center">
            <div className="w-1/3 pt-5">
                <DynamicForm<FormFields> schema={schema} defaultValues={defaultValues} operation={operation} onSubmit={onSubmit} />
            </div>
        </div>
    )
}

export default EditPage
