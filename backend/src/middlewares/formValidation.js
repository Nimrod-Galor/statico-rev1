import { schemaRegistry } from '../../../shared/schemas/index.ts' 

export function formValidation(validationSchema){
    // console.log("formValidation middleware called", validationSchema)
    return async function(req, res, next){
        if(validationSchema === undefined){
            console.log("no schema")
            const { contentType} = req.params
            // If no validation schema is provided, use the schema from the registry based on contentType
            validationSchema = schemaRegistry[contentType]
        }
        const parsed = await validationSchema.safeParseAsync(req.body)

        if (!parsed.success) {
            // If validation fails, return a 400 error with validation errors
            return res.status(400).json({ errors: parsed.error.errors })
        }
    
        // If validation passes, proceed with the request
        req.parsedData = parsed.data
        next()
    }
}