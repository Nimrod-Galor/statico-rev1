import { useForm } from 'react-hook-form';
import type { FieldErrors, SubmitHandler } from 'react-hook-form';
import { z, ZodObject } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


// Define the DynamicForm component
import type { DefaultValues } from 'react-hook-form';

interface DynamicFormProps<T> {
  schema: ZodObject<any>;
  defaultValues?: DefaultValues<T>;
  operation:string | undefined;
  onSubmit: SubmitHandler<T>;
}

function DynamicForm<T extends {}>({ schema, defaultValues, operation, onSubmit }: DynamicFormProps<T>) {
    // type FormFields = z.infer<typeof schema>;

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const fields = Object.entries(schema.shape);

  const catchSubmitError = async (data: T) => {
    try{
      await onSubmit(data)
    }catch(err){
      console.log("nimerr")
      setError("root", { message: (err as { message: string }).message });
    }
  }

  return (
    <div>
    {errors.root && <div className="text-red-500 text-sm mt-1">
        {errors.root.message as string}
        </div>
    }

    <form onSubmit={handleSubmit(catchSubmitError)}>
          {fields.map(([field, definition]) => {
            const isNumber = definition instanceof z.ZodNumber;
            const isBoolean = definition instanceof z.ZodBoolean;
            const isEnum = definition instanceof z.ZodEnum;
            const isDate = definition instanceof z.ZodDate;

            return (
              <div key={field}>
                <label htmlFor={field} className="block mb-2 font-semibold">
                  {field}
                </label>
                {isBoolean ? (
                  <input
                    type="checkbox"
                    id={field}
                    {...register(field as any)}
                    className="mr-2"
                  />
                ) : isEnum ? (
                  <select id={field} {...register(field as any)} className="w-full p-2 border rounded-2xl">
                    {definition.options.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field}
                    type={isNumber ? 'number' : isDate? 'date' : 'text'}
                    {...register(field as any)}
                    className="w-full p-2 border rounded-2xl focus:outline-none"
                  />
                )}
                {errors[field as keyof FieldErrors<T>] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field as keyof T]?.message as string}
                  </p>
                )}
              </div>
            );
          })}
          <button type="submit" disabled={isSubmitting} className="w-full p-2 mt-4 rounded-2xl bg-blue-600 text-white hover:cursor-pointer">
            {isSubmitting ? "Loading..." : operation == 'edit' ? 'update' : 'create' }
          </button>
        </form>
        </div>
    );
}

export default DynamicForm;