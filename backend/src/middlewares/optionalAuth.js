import passport  from 'passport'

export const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt-optional', { session: false }, (err, user) => {
  if (err) {
    req.user = { id: null, roles: ['guest'] }; // fallback on error
  } else {
    console.log("Optional Auth - User:", user);
    req.user = user || { id: null, roles: ['guest'] }; // fallback if user is null
  }
  next();
  })(req, res, next);
}