
// import { schemas } from "../../../shared/schemas";
import { z } from 'zod'
import { useParams, useNavigate } from 'react-router-dom'
// import DynamicForm from '../components/DynamicForm';
import { useQuery } from "@tanstack/react-query";
import { getItem, updateItem, createItem, getItems } from "../api";


import type { SubmitHandler } from "react-hook-form";
import ContentFormSwitcher from '../components/ContentFormSwitcher';

function EditPage() {
    const { contentType = 'role', operationType = 'create', contentId } = useParams();

    // if operationType 'edit' get item values for the form default values
    const query = useQuery({
        queryKey: ['get-item', {contentType, operationType, contentId}],
        queryFn: () => getItem(contentType, contentId),
        select(data) { return data.data },
        enabled: operationType == 'edit'
    })

    // set form default values
    const defaultValues = query.data || {}

    console.log('defaultValues: ', defaultValues)

    // Query Loading
    if(query.isLoading){
        return(<div>Loading...</div>)
    }

    // Query Error
    if(query.isError){
        const error = query.error as { response?: { data?: { message?: string } }, message: string };
        const errorMessage = error.response?.data?.message || error.message;
        return(<div className="text-red-600 text-center">{errorMessage}</div>)
    }

    // Form Page
    return (
        <div className="">
            <div className="flex flex-col justify-center px-6 py-10 lg:px-8">
                <h1 className="text-center text-2xl mt-7">{operationType === 'edit' ? 'Edit' : 'Create'} {contentType}</h1>

                <ContentFormSwitcher defaultValues={defaultValues} />
            </div>
        </div>
    )
}

export default EditPage
