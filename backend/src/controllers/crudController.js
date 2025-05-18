import { findUnique, readRow, readRows, updateRow, createRow, deleteRow, deleteRows, countRows } from '../../db.js';
import { dbInterface } from '../prisma/dbInterface.js';

function smartConvert(value) {
    // if(isJsonObject(value)) return JSON.parse(value);
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
}

// Logic to fetch all items from the database
export const getProducts = async (req, res) => {
    const { contentType } = req.params;
    const { ...filters } = req.query;
    console.log("Get products for contentType:", contentType, " with filters:", filters);

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

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

        res.status(200).json({ status: "success", data: response });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error fetching '${contentType}'` });
        return
    }
}

// Logic to fetch an item by ID from the database
export const getProductById = async (req, res) => {
    const { contentType, id } = req.params;

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    try{
        let response = await readRow(contentType, {
            where: {
                id: parseInt(id)
            },
            select: dbInterface[contentType].select
        })
        
        res.status(200).json({ status: "success", data: response });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error fetching '${contentType}'` });
        return
    }
}

// Logic to create a new item in the database
export const createProduct = async (req, res) => {
    const { contentType } = req.params;
    const data = req.body;

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
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
export const updateProduct = async (req, res) => {
    const { contentType, id } = req.params;

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    const data = req.body;
    // Check if the ID is valid
    if (!id || isNaN(id)) {
        return res.status(400).json({ status: "error", message: `Invalid ID: ${id}` });
    }

    // Check if the item exists
    try{
        const item = await findUnique(contentType, {
            id: parseInt(id)
        });
    
        if (!item) {
            return res.status(404).json({ status: "error", message: `${contentType} not found` });
        }

        // Update the item
        const updatedItem = await updateRow(contentType, {
            id: parseInt(id)
        }, data);

        res.status(200).json({ status: "success", message: `${contentType} updated`, data: updatedItem });
    }
    catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error updating '${contentType}'` });
        return
    }
}

// Logic to delete an item by ID from the database
export const deleteProduct = async (req, res) => {
    const { contentType, id } = req.params;

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    // Check if the ID is valid
    if (!id || isNaN(id)) {
        return res.status(400).json({ status: "error", message: `Invalid ID: ${id}` });
    }

    // Check if the item exists
    try{
        const item = await findUnique(contentType, {
            id: parseInt(id)
        });
    
        if (!item) {
            return res.status(404).json({ status: "error", message: `${contentType} not found` });
        }

        // Delete the item
        await deleteRow(contentType, {
            id: parseInt(id)
        });
    
        res.status(200).json({ status: "success", message: `${contentType} deleted` });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error deleting '${contentType}'` });
        return
    }   
}

