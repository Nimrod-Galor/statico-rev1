import {z} from 'zod'
import { useParams } from 'react-router-dom'

import { formSchemas } from '../models/formSchemas.ts'
import { schemaRegistry } from '../../../shared/schemas/'
import DynamicForm from './DynamicForm'

import type { DefaultValues } from 'react-hook-form';
import type { FormField } from '../models/formSchemas.ts'


type ContentFormSwitcherProps = {
    defaultValues?: DefaultValues<any>
}

const ContentFormSwitcher: React.FC<ContentFormSwitcherProps> = ({defaultValues}) => {
    const { contentType = 'role', operationType = 'create'} = useParams()
    // const formfieldsSchema = formSchemas[contentType].fields.filter(item => item.displayInForm)
    const formfieldsSchema: FormField[] = (formSchemas as FormSchemas)[contentType].fields.filter((item: FormField) => item.displayInForm);
    const validationSchema = operationType === 'edit' && contentType === 'user' ? schemaRegistry['userEdit'] : schemaRegistry[contentType as keyof typeof schemaRegistry]
    

    if (!formfieldsSchema){
        return <div>Unknown content type</div>
    }

    interface FormSchemas {
        [key: string]: {
            fields: FormField[];
        };
    }

    interface SchemaRegistry {
        [key: string]: z.ZodType<any, any>;
    }

    // Create a Set of field names to remove
    const keysToRemove = new Set(formfieldsSchema.map(field => field.name))

    // Create new object without the keys to remove
    defaultValues = Object.fromEntries(
        Object.entries(defaultValues).filter(([key]) => keysToRemove.has(key))
    )

    return <DynamicForm formfieldsSchema={formfieldsSchema} validationSchema={validationSchema as unknown as z.ZodObject<any>} defaultValues={defaultValues} />
}

export default ContentFormSwitcher