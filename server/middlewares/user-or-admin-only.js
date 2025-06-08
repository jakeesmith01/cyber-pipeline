/* check if a user is an admin or a user */
const userOrAdminOnly = (req, res, next) => {
  if (req.roles.includes('admin') || req.roles.includes('user')) {
    next()
  } else {
    res.status(403)
    res.json({ error: 'Users or Admins Only' })
  }
}

export default userOrAdminOnly
