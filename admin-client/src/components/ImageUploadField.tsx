import React, { useEffect, useRef } from 'react'
import { set, useFieldArray, useWatch } from 'react-hook-form'
import { deleteFile } from '../api'

import type { Control, UseFormRegister, UseFormSetValue, FieldErrors, UseFormGetValues } from 'react-hook-form'

import type { ImageFormData } from '../../../shared/schemas/image.schema'
import toast from 'react-hot-toast'


export type ImageUploadFieldProps = {
  name: string;
  control: Control<any>;
  register: UseFormRegister<any>;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  defaultImages?: ImageFormData['images'];
  errors?: FieldErrors<any>;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ name, control, register, getValues, setValue, defaultImages = [], errors, }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const watchedFields = useWatch({ control, name }) || []

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name,
    })

    // console.log('defaultImages: ', defaultImages)

    // Initialize with default images if provided
    useEffect(() => {
        if (defaultImages.length) {
            replace(
                defaultImages.map((img) => ({
                    file: new File([], img.alt || 'image.jpg', { type: 'image/jpeg' }),
                    alt: img.alt,
                    url: img.url,
                    id: img.id
                }))
            )
        }
    }, [defaultImages, replace]);

    // Handle file input changes and drag & drop
    const handleFiles = (files: FileList | null) => {
        if (!files){
            return
        }
        const fileArray = Array.from(files)
        fileArray.forEach((file) => {
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file)
                append({
                    file,
                    alt: '',
                    url,
                    id: '', // Initially empty, will be set after upload
                })

                // Then manually set values to ensure form state tracks them
                const index = fields.length; // Get the current index for the new field
                setValue(`${name}.${index}.file`, file);
                setValue(`${name}.${index}.alt`, '');
                setValue(`${name}.${index}.url`, url);
            }
        })



        if (fileArray.length > 0) {
            toast.success(`${fileArray.length} image(s) added successfully.`);
        } else {
            toast.error('No valid images found.');
        }
    }

    const handleDeleteFile = async (index: number) => {
        if(confirm('Are you sure you want to delete this image?')) {
            const image = watchedFields[index]

            // Remove the file from the field array
            remove(index)

            // If the image has an ID, attempt to delete it from the server
            if (image.id) {
                try {
                    const response = await deleteFile('file', String(image.id))

                    // Log the response or handle it as needed
                    console.log('File deleted successfully:', response)
                    toast.success('Image deleted successfully.')
                } catch (error) {
                    console.error('Error deleting file:', error)
                    toast.error('Failed to delete image. Please try again.')
                    return
                }

            }
        }
    }

    return (
        <div className="space-y-4">
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                }}
                className="border-2 border-dashed p-6 text-center rounded-lg cursor-pointer hover:bg-gray-50"
            >
                <p>Click or drag & drop to upload images</p>
                <input type="file" multiple accept="image/*" ref={inputRef} onChange={(e) => handleFiles(e.target.files)} hidden />
            </div>

            {errors?.[name]?.message && (
                <p className="text-red-600 text-sm">{errors[name]?.message as string}</p>
            )}

            <div className="grid gap-4">
                {fields.map((field, index) => {
                    // const image = watchedFields[index]
                    const image = getValues(`${name}.${index}`) || {}
                    const imageErrors = (errors?.[name] as FieldErrors<any>[] | undefined)?.[index]
                    const fieldName = `${name}.${index}`

                    return (
                        <div key={field.id} className="flex border p-3 rounded-lg bg-white shadow-sm flex gap-4 items-start" >
                            <img src={ image?.url || (image?.file instanceof File && image?.file.size > 0 ? URL.createObjectURL(image.file) : '') } alt="preview" className="w-24 h-24 object-cover rounded" />

                            <div className="flex-grow">
                                <button type="button" onClick={() => handleDeleteFile(index)} className="bg-red-500 p-1 rounded rounded-sm text-white mb-2 float-end hover:cursor-pointer" >
                                    ✕
                                </button>
                                <div>
                                    <input {...register(`${fieldName}.alt`)} defaultValue={image.alt} placeholder="Alt text" className="w-full border p-2 rounded" />
                                    {imageErrors?.alt && ( <p className="text-red-500 text-sm mt-1"> {imageErrors.alt.message as string} </p> )}
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}
