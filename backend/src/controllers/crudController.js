import fs from 'fs'
import { findUnique, readRow, readRows, updateRow, createRow, deleteRow, deleteRows, countRows } from '../../db.js';
import { dbInterface } from '../models/dbInterface.js';
import { hasPermission } from '../../../shared/permission/auth-abac.ts'

const PORT = process.env.PORT || 5173
const BASE_URL = `http://localhost:${PORT}`;

function smartConvert(value) {
    // if(isJsonObject(value)) return JSON.parse(value);
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
}

function setFilters(contentType, filters){
    let where = {};
    const orderBy = []
    // Construct the where clause based on filters
    if (filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (key in dbInterface[contentType].select) {
                // filter results
                where[key] = smartConvert(value);
            }else if (key === "asc" || key === "desc") { 
                // sort
                if(Object.keys(dbInterface[contentType].select).includes(value)){
                    orderBy.push({[value]: key})
                }
            }
        }
    }
    return { where, orderBy }
}


// Fetch all items of a specific content type from the database
export const getItems = async (req, res) => {
    const { contentType } = req.params;
    const { ...filters } = req.query;
    console.log("Get products for contentType:", contentType, " with filters:", filters);

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    const { where, orderBy } = setFilters(contentType, filters);

    console.log("Where clause:", where, " Order by:", orderBy);

    try{
        const query = {
            "skip": req.query.page ? (req.query.page - 1) * 10 : 0,
            "take": 10,
            where,
            "select": dbInterface[contentType].select,
            orderBy
        }
        //  Get  data
        let response = await readRows(contentType, query)

        // destruct nested fields
        if('destructur' in dbInterface[contentType]){
            response = response.map(dbInterface[contentType].destructur)
        }

        res.status(200).json({ status: "success", data: response });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error fetching '${contentType}'` });
        return
    }
}

// Logic to fetch an item by ID from the database
export const getItemById = async (req, res) => {
    const { contentType, id } = req.params;

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    try{
        let response = await readRow(contentType, {
            where: {
                id: id
            },
            select: dbInterface[contentType].select
        })
        
        // destruct nested fields
        if('destructur' in dbInterface[contentType]){
            response = dbInterface[contentType].destructur(response)
        }
        
        console.log("response", response)
        
        res.status(200).json({ status: "success", data: response });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error fetching '${contentType}'` });
        return
    }
}

// Logic to create a new item in the database
export const createItem = async (req, res) => {
    const { contentType } = req.params
    let data = req.parsedData

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }
    
    if('constructur' in dbInterface[contentType]){
        // If a constructor function is defined, use it to transform the request data
        // response.map(dbInterface[contentType].destructur)
        data = dbInterface[contentType].constructur(data);
    }

    try{
        const newItem = await createRow(contentType, data);
    
        res.status(201).json({ status: "success", message: `${contentType} created`, data: newItem });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error creating '${contentType}'` });
        return
    }
}

// Logic to update an item by ID in the database
export const updateItem = async (req, res) => {
    const { contentType, id } = req.params;
    let data = req.parsedData

    
    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }
    
    // Check if the ID is valid
    if (!id) {
        return res.status(400).json({ status: "error", message: `Invalid ID: ${id}` });
    }
    
    try{
        // Check if the item exists
        const item = await findUnique(contentType, { id });
    
        if (!item) {
            return res.status(404).json({ status: "error", message: `${contentType} not found` });
        }

        if('constructur' in dbInterface[contentType]){
            // If a constructor function is defined, use it to transform the request data
            data = dbInterface[contentType].constructur(data);
        }

        // Update the item
        console.log("data:", data.roles)
        const updatedItem = await updateRow(contentType, { id }, data);

        res.status(200).json({ status: "success", message: `${contentType} updated`, data: updatedItem });
    }
    catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error updating '${contentType}'` });
        return
    }
}

// Logic to delete an item by ID from the database
export const deleteItem = async (req, res) => {
    const { contentType, id } = req.params;

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    // Check if the ID is valid
    if (!id) {
        return res.status(400).json({ status: "error", message: `Invalid ID: ${id}` });
    }

    // Check if the item exists
    try{
        const item = await findUnique(contentType, {
            id: id
        });
    
        if (!item) {
            return res.status(404).json({ status: "error", message: `${contentType} not found` });
        }

        // Delete the item
        await deleteRow(contentType, {
            id: id
        });
    
        res.status(200).json({ status: "success", message: `${contentType} deleted` })
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error deleting '${contentType}'` })
        return
    }   
}

export const getConyectTypes = async (req, res) => {
    try {
        const categories = Object.keys(dbInterface)
        res.status(200).json({ status: "success", data: categories });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: "Error fetching categories" });
        return
    }
}

export const getTotalPages = async (req, res) => {
    const { contentType } = req.params
    const { ...filters } = req.query

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` })
    }

    const { where } = setFilters(contentType, filters)

    try {
        const rowsCount = await countRows(contentType, where)
        console.log("Rows count for contentType:", contentType, "is", rowsCount)

        // Calculate total pages based on rows count
        const totalPages = Math.ceil(rowsCount / 10); // Assuming 10 items per page
        
        res.status(200).json({ status: "success", data: totalPages })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", message: `Error fetching count for '${contentType}'` })
    }
}

export const uploadFiles = async (req, res) => {
    const { contentType, id } = req.params;

    const files = req.files
    const body = req.body
 
    console.log('body', body)

    // Check if files are provided
    // if (!files || files.length === 0) {
    //     return res.status(204).json({ error: 'No files uploaded' })
    // }

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    // Check if the ID is valid
    if (!id) {
        return res.status(400).json({ status: "error", message: `Invalid ID: ${id}` });
    }

    // Check if the item exists
    try {
        const item = await findUnique(contentType, {
            id: id
        });

        if (!item) {
            return res.status(404).json({ status: "error", message: `${contentType} not found` });
        }

        // Parse newImages
        const storedFiles = await Promise.all(
            files.map((file) => {
                const match = file.fieldname.match(/^newImages\[(\d+)\]\.file$/);
                if (!match) return;
                
                const index = match[1];
                const fileUrl = `${BASE_URL}/uploads/${file.filename}`
                const altKey = body[`newImages[${index}].alt`];
                return createRow('file',{
                        filename: file.filename,
                        url: fileUrl,
                        productId: id,
                        alt: altKey || '',
                    })
            })
        )

        // Parse existingImages
        const updateImagesAlt = await Promise.all(
            Object.keys(body).map( (key) => {
                const match = key.match(/^existingImages\[(\d+)\]\.alt$/)
                if (!match) return

                const index = match[1]
                const alt = body[`existingImages[${index}].alt`] || 'nimo'

                return updateRow('file', {
                    id: body[`existingImages[${index}].id`]
                }, {
                    alt: alt
                })
            })
        )
        
        

        res.status(200).json({ status: "success", message: 'Files uploaded and linked to product', files: storedFiles })
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: `Error uploading files for '${contentType}'` });
        return;
    }
}

export const deleteFile = async (req, res) => {
    const { fileId } = req.params;

    // Check if the file ID is valid
    if (!fileId) {
        return res.status(400).json({ status: "error", message: `Invalid file ID: ${fileId}` });
    }

    try {
        // Check if the file exists
        const file = await findUnique('file', { id: fileId });

        if (!file) {
            return res.status(404).json({ status: "error", message: `File not found` });
        }

        // Delete the file record from the database
        await deleteRow('file', { id: fileId });

        // Delete the actual file from disk or cloud storage here
        const filePath = `./uploads/${file.filename}`
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        res.status(200).json({ status: "success", message: `File deleted successfully` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: `Error deleting file` });
        return;
    }
}