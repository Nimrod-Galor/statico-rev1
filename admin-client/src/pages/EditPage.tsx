import { useParams } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
import { getItem } from "../api";

import FormSchema from '../components/FormSchema';

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
    return(<FormSchema defaultValues={defaultValues} />)

}

export default EditPage
