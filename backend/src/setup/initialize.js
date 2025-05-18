import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const product = {
    metatitle:  "Statico Default Home Page",
    metadescription:  "Statico Default Home Page",
    slug:   "home",
    title:  "Statico Default Home Page",
    body:  "Statico Default Home Page",
    publish: true
}
await prisma.page.create({data: product})
// Update Progress
console.log('product Created.\n')