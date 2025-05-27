import { useForm } from 'react-hook-form'
import { useQueries } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { getItems, updateItem, createItem } from '../api'

import type { UseQueryResult } from '@tanstack/react-query'
import type { FieldErrors, SubmitHandler } from 'react-hook-form'
import type { DefaultValues } from 'react-hook-form'; 
import type {FormField, FormSchema} from '../models/formSchemas'

type DynamicFormProps<T> = {
  formSchema: FormSchema;
  validationSchema: any;
  defaultValues?: DefaultValues<T>;
}

// function DynamicForm<T extends {}>({ schema, defaultValues, operationType, onSubmit }: DynamicFormProps<T>) {
function DynamicForm<T extends Record<string, any> = Record<string, any>>({ formSchema, validationSchema, defaultValues }: DynamicFormProps<T>) {
  const { contentType = 'role', operationType = 'create', contentId = '' } = useParams();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(validationSchema),
    defaultValues
    // : async () => {
    //   const result = await getItem(contentType, contentId)
    //   return result.data
    // }
  });

  let navigate = useNavigate()

  // Identify all dynamic select fields
  const dynamicSelects = formSchema.fields.filter((f) => f.type === 'select' && f.fetchFrom)

  // Run queries for each select
  const queryResults = useQueries({
    queries: dynamicSelects.map((field) => ({
      queryKey: ['selectOptions', field.name],
      queryFn: () => getItems(field.fetchFrom as string, '1'),
    })),
  });

  // Wait for all select queries to finish loading
  const isLoadingSelects = queryResults.some((result) => result.isLoading)

  if (isLoadingSelects) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-gray-500">Loading...</span>
      </div>
    )
  }

  const getSelectOptions = (fieldName: string): { id: string; name: string }[] => {
    const index = dynamicSelects.findIndex((f) => f.name === fieldName)
    const result: UseQueryResult<any, any> = queryResults[index]
    return result?.data.data || []
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return <textarea {...register(field.name as any)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"  />;
      case 'select':
        const options = field.options || getSelectOptions(field.name);
        return (
          <select {...register(field.name as any)} id={field.name} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            {options.map((opt) => (
              <option key={opt.id} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
        );
        case 'check':
          return <input type="checkbox" id={field.name} {...register(field.name as any)} className="float-left mt-1 me-3 inline w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6" />
      default:
        return <input type={field.type} {...register(field.name as any)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />;
    }
  };

  const onSubmit: SubmitHandler<Record<string, string>> = async (data) => {
    try{
        if(operationType == 'edit'){
            await updateItem(contentType, contentId, data)
            navigate(`/admin/${contentType}`)
            toast.success(`${contentType} Updated.`)
        }else{
            await createItem(contentType, data)
            navigate(`/admin/${contentType}`)
            toast.success(`${contentType} Created.`)
        }
    }catch(err){
        setError("root", { message: (err as { message: string }).message });
    }
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      {errors.root && <div className="text-red-500 text-sm mt-1">{errors.root.message as string}</div>}

      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        {formSchema.fields.filter(item => item.displayInForm).map((field) => (
        <div key={field.name} className='pt-2'>
          <label className="block text-sm/6 font-medium text-gray-900">
            {field.label}
            {renderField(field)}
          </label>
          {errors[field.name as keyof FieldErrors<T>] && (
            <div className="text-red-500 mb-3">
              {errors[field.name as keyof T]?.message as string}
            </div>
          )}
        </div>
      ))}

      <div className='flex justify-evenly gap-2'>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 mt-4 rounded-2xl bg-blue-600 text-white hover:cursor-pointer">
          {isSubmitting ? "Loading..." : operationType == 'edit' ? 'update' : 'create' }
        </button>
        <Link to="/admin" className="w-full text-center p-2 mt-4 rounded-2xl bg-yellow-600 text-white hover:cursor-pointer">
          Cancel
        </Link>
      </div>
      </form>
      </div>
  )
}

export default DynamicForm;