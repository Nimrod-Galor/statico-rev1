export function formValidation(validationSchema){
        return async function(req, res, next){
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