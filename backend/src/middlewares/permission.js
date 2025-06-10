import { hasPermission } from '../../../shared/permission/auth-abac.ts'

export const checkPermission = (action, Resource) => {
  
  return (req, res, next) => {
    const resource = Resource == undefined ? req.params.contentType : Resource
    console.log("user:", req.user)
    if (hasPermission(req.user, resource, action)) {
      // User has the required permission, proceed to the next middleware or route handler
      return next()
    }

    return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' })
  }
}