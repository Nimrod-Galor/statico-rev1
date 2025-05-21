import { findUnique, readRow, readRows, updateRow, createRow, deleteRow, deleteRows, countRows } from '../../db.js';
import { dbInterface } from '../models/dbInterface.js';

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

// Logic to fetch all items from the database
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
        
        res.status(200).json({ status: "success", data: response });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error fetching '${contentType}'` });
        return
    }
}

// Logic to create a new item in the database
export const createItem = async (req, res) => {
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
export const updateItem = async (req, res) => {
    const { contentType, id } = req.params;
    const data = req.body;

    
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

        // Update the item
        const updatedItem = await updateRow(contentType, {
            id: id
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
    
        res.status(200).json({ status: "success", message: `${contentType} deleted` });
    }catch(err){
        console.log(err)
        res.status(500).json({ status: "error", message: `Error deleting '${contentType}'` });
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
    const { contentType } = req.params;
    const { ...filters } = req.query;

    // Check if the content type is valid
    if (!dbInterface[contentType]) {
        return res.status(400).json({ status: "error", message: `Invalid content type: ${contentType}` });
    }

    const { where } = setFilters(contentType, filters);

    try {
        const rowsCount = await countRows(contentType, where);
        const totalPages = (10 % rowsCount) + 1
        res.status(200).json({ status: "success", data: totalPages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: `Error fetching count for '${contentType}'` });
    }
}
