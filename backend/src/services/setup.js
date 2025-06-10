//************************ */
// Initialize DB
//************************ */

import { PrismaClient } from '@prisma/client'
import { createUser } from '../utils/index.js'

const prisma = new PrismaClient()

console.log("Initiate setup.")
console.log("Create roles.")

// *********************** //
// Create Roles
// *********************** //
// Role defenition
const roles = [
    {
        name: 'subscriber',
        description: 'Somebody who can only manage their profile.',
        default: true
    },
    {
        name: 'contributor',
        description: 'Somebody who can write and manage their own posts but cannot publish them.'
    },
    {
        name: 'author',
        description: 'Somebody who can publish and manage their own posts.'
    },
    {
        name: 'editor',
        description: 'Somebody who can publish and manage posts including the posts of other users.'
    },
    {
        name: 'admin',
        description: 'Somebody who has access to all the administration features within a single site.'
    }
]

// create roles
const rolesPromise = []
for(let i=0; i<roles.length; i++){
    rolesPromise.push(prisma.role.create({ data: roles[i]} ) )
}

const rolesCreated = await Promise.all(rolesPromise)


// *********************** //
// Create Admin User
// *********************** //
console.log("Create Admin user.")
const adminData = {
    email: 'admin@admin.com',
    password: 'Admin12!',
    userName: 'Admin',
    roles: rolesCreated[4].id // Assigning the admin role
}

await createUser(adminData)

console.log("setup Done.")
