import {z} from 'zod'
import { formSchemas } from '../models/formSchemas.ts';
import { schemaRegistry } from '../../../shared/schemas/';


import DynamicForm from './DynamicForm';
import { useParams } from 'react-router-dom';

import type { DefaultValues } from 'react-hook-form'; 
// type ContentType = keyof typeof schemaRegistry;

type ContentFormSwitcherProps = {
    defaultValues?: DefaultValues<any>;
//   contentType: string; 
  //ContentType;
//   operationType: string;
//   onSubmit: (data: Record<string, string>) => void;
}

const ContentFormSwitcher: React.FC<ContentFormSwitcherProps> = ({defaultValues}) => {
    const { contentType = 'role'} = useParams();
    const formSchema = formSchemas[contentType];
    const validationSchema = schemaRegistry[contentType as keyof typeof schemaRegistry];

    if (!formSchema) return <div>Unknown content type</div>;

    return <DynamicForm formSchema={formSchema} validationSchema={validationSchema as unknown as z.ZodObject<any>} defaultValues={defaultValues} />;
};

export default ContentFormSwitcher;