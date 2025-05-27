import {z} from 'zod'
import { useParams } from 'react-router-dom'

import { formSchemas } from '../models/formSchemas.ts'
import { schemaRegistry } from '../../../shared/schemas/'
import DynamicForm from './DynamicForm'

import type { DefaultValues } from 'react-hook-form';


type ContentFormSwitcherProps = {
    defaultValues?: DefaultValues<any>
}

const ContentFormSwitcher: React.FC<ContentFormSwitcherProps> = ({defaultValues}) => {
    const { contentType = 'role'} = useParams()
    const formSchema = formSchemas[contentType]
    const validationSchema = schemaRegistry[contentType as keyof typeof schemaRegistry]

    if (!formSchema) return <div>Unknown content type</div>

    return <DynamicForm formSchema={formSchema} validationSchema={validationSchema as unknown as z.ZodObject<any>} defaultValues={defaultValues} />
}

export default ContentFormSwitcher