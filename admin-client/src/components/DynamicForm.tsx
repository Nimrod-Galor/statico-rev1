import { useEffect, useState } from 'react'
import { useForm, useWatch, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { useQueries } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { getItems, updateItem, createItem, uploadFiles } from '../api'
import PasswordInput from './PasswordInput'
import { ImageUploadField } from './ImageUploadField'
import SlateEditor from './wysiwyg/SlateEditor'




import type { ImageFormData } from '../../../shared/schemas/image.schema'
import type { UseQueryResult } from '@tanstack/react-query'
import type { SubmitHandler } from 'react-hook-form'
import type { DefaultValues } from 'react-hook-form'; 
import type { FormField } from '../models/formSchemas'
import type { FieldValues } from 'react-hook-form'


import { useAuth } from '../context/AuthProvider'

type DynamicFormProps<T extends object> = {
  formfieldsSchema: FormField[];
  validationSchema: any; 
  // ZodType<any, any, any>;
  defaultValues?: DefaultValues<T>;
}

// function DynamicForm<T extends {}>({ schema, defaultValues, operationType, onSubmit }: DynamicFormProps<T>) {
function DynamicForm<T extends object>({ formfieldsSchema, validationSchema, defaultValues }: DynamicFormProps<T>) {
  let { contentType = 'role', operationType = 'create', contentId = '' } = useParams();
  const auth = useAuth()
  const navigate = useNavigate()

  type FormValues = z.infer<typeof validationSchema>

  const methods = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues
    : {
      ...defaultValues,
      ...(formfieldsSchema.some(f => f.name === 'authorId') && { authorId: operationType === (defaultValues && (defaultValues as any).authorId) || auth.userId }),
      ...(formfieldsSchema.some(f => f.name === 'body') && { body: (defaultValues && (defaultValues as any).body) || [ { type: "paragraph", children: [{ text: "" }] }  ] })
    },
  })

  const { control, register, handleSubmit, getValues, setValue, setError, resetField, formState: { errors, isSubmitting } } = methods

  console.log("defaultValues: ", defaultValues)


   useEffect(() => {
  // // Reset the form select items with default values if provided
    if( defaultValues) {
      queryResults.forEach((result, index) => {
        const field = dynamicSelects[index].name
        resetField(field, { defaultValue: (defaultValues as Record<string, any>)[field] || [] })
      })
    }
  }, [defaultValues, resetField])


  // If defaultValues is not provided, use an empty object
  const defaultImages = (defaultValues as { files?: ImageFormData['images'] })?.files || []

  // Identify all dynamic select fields
  const dynamicSelects = formfieldsSchema.filter((f) => f.type === 'select' && f.fetchFrom)

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

  

  // Function to get options for a select field
  const getSelectOptions = (fieldName: string): { id: string; name: string }[] => {
    const index = dynamicSelects.findIndex((f) => f.name === fieldName)
    const result: UseQueryResult<any, any> = queryResults[index]
    return result?.data.data || []
  };

  // Render each field based on its type
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'wysiwyg':
        const slateValue = useWatch({ control, name: field.name })

        return(<>
          <label htmlFor={`field-${field.name}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
          <textarea id={`field-${field.name}`}
            value={JSON.stringify(slateValue)}
            onChange={(e) => { setValue(field.name, JSON.parse(e.currentTarget.value)) }} // update RHF & Slate
            
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
        </>)
      case 'textarea':
        return(<>
          <label htmlFor={`field-${field.name}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
          <textarea {...register(field.name as any)} id={`field-${field.name}`} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
        </>)
      case 'select':
        // const options = field.options || getSelectOptions(field.name);
        const options = field.options ? field.options.concat(getSelectOptions(field.name)) : getSelectOptions(field.name);
        return(<>
          <label htmlFor={`field-${field.name}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
          <select {...register(field.name as any)} id={`field-${field.name}`} multiple={field.multi} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {options.map((opt) => (
              <option key={opt.id} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
        </>)
      case 'check':
        return(<div className="flex items-center mb-4">
          <input type="checkbox"  id={`field-${field.name}`} {...register(field.name as any)} className="float-left ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" />
          <label htmlFor={`field-${field.name}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{field.label}</label>
        </div>)
      case 'password':
        return(<>
            <label htmlFor={`field-${field.name}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
            <PasswordInput {...register(field.name as any)} id={`field-${field.name}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </>)
      case 'hidden':
        return(<input type="hidden" {...register(field.name as any)} />)
      case 'file':
        return(
          <ImageUploadField
            name="files"
            control={control}
            register={register}
            getValues={getValues}
            setValue={setValue}
            errors={errors}
            defaultImages={defaultImages}
          />
        )
      default:
        return(<>
          <label htmlFor={`field-${field.name}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.label}</label>
          <input type={field.type} id={`field-${field.name}`} {...register(field.name as any)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </>)
    }
  }

  
  const onSubmit: SubmitHandler<T> = async (data: FormValues) => {

    // update select fields to match the expected format. ID in value.
    dynamicSelects.forEach((field) => {
      if(data[field.name as keyof T] === 'None' || data[field.name as keyof T] === '' || data[field.name as keyof T] === undefined){
        //delete the field if it's empty
        delete data[field.name as keyof T]
      }else{
        const selectedOptions = data[field.name as keyof T] as string[]
        // reset to an array
        data[field.name as keyof T] = new Array<string | number>()

        // for each selected option, find the corresponding option ID in the fetched options
        selectedOptions.forEach(selectedOption => {
          const option = getSelectOptions(field.name).find(opt => opt.name === selectedOption)
          if (option) {
            data[field.name as keyof T].push(option.id as any) // update to use id
          }
        })
      }
    })

    try{
      // if files are present, prepare FormData for file upload
      const formData = new FormData();
      if (data.files?.length > 0) {
        
        (data.files as ImageFormData['images']).forEach((item, index) => {
          // Check if the item has a file and it's a valid File object ( new file)
          if (item.file instanceof File && item.file.size > 0) {
            // Append the file to the FormData object
            formData.append(`newImages[${index}].file`, item.file)
            formData.append(`newImages[${index}].alt`, item.alt || '')
          }else{
            formData.append(`existingImages[${index}].alt`, item.alt || '')
            formData.append(`existingImages[${index}].id`, String(item.id))
          }
        })
      }
      delete data.files

      let action = ''
      if(operationType == 'edit'){
        await updateItem(contentType, contentId, data as DefaultValues<T>)
        action = 'Updated'
      }else{
        const newItem = await createItem(contentType, data as DefaultValues<T>)
        console.log("newItem: ", newItem)
        contentId = newItem.userId; // Get the newly created item's ID
        action = 'Created'
      }

      if (formData.values.length > 0) {
        const result = await uploadFiles(contentType, contentId, formData);
  
        console.log('upload result: ', result.data)

        // If the upload was successful, remove the files from the data object
        if (result.status !== 500) {
        } else {
          console.error('File upload failed:', result.data.message);
          throw new Error(result.data.message || 'File upload failed');
        }

      }

      navigate(`/admin/${contentType}`)
      toast.success(`${contentType} ${action}.`)
    }catch(err){
      console.log("onsubmit error: ", err)
        setError("root", { message: (err as { message: string }).message });
    }
  }

console.log("errors", errors)

  return (
    <FormProvider {...methods}>
      <div className='flex flex-row'>
        <div className="flex flex-col justify-center px-6 py-10 lg:px-8">
          <h1 className="text-center text-2xl mt-7">{operationType === 'edit' ? 'Edit' : 'Create'} {contentType}</h1>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {errors.root && <div className="text-red-500 text-sm mt-1">{errors.root.message as string}</div>}

            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)} noValidate>
              {formfieldsSchema.map((field) => (
                <div key={field.name} className='pt-2'>
                  {renderField(field)}
                  {errors[field.name as keyof FieldValues] && (
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
                <button type="button" onClick={() => navigate(-1)} className="w-full text-center p-2 mt-4 rounded-2xl bg-yellow-600 text-white hover:cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {contentType === 'page' && methods.getValues("body") &&  <div className='flex flex-1'><SlateEditor key="editor-visible" name='body' /></div>}
      </div>
    </FormProvider>
  )
}

export default DynamicForm;