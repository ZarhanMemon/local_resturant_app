import Item from "../models/items.models.js";
import Restaurant from "../models/restaurant.models.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, description, category, price, isVeg, discountPercent } =
      req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const rest = await Restaurant.findOne({ owner: req.userId });
    if (!rest) {
      return res.status(400).json({ message: "restaurant not founded" });
    }

    const item = await Item.create({
      name,
      description,
      category,
      price,
      isVeg,
      discountPercent,
      image,
      restaurant: rest._id,
    });

    // add item to restaurant's items array
    rest.items.push(item._id);
    await rest.save();

    return res.status(201).json(rest);
  } catch (error) {
    res.status(500).json({ message: `add item error :${error}` });
  }
};

export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, description, category, price, isVeg, discountPercent } =
      req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // find restaurant of logged-in owner
    const rest = await Restaurant.findOne({ owner: req.userId });

    if (!rest) {
      return res.status(400).json({ message: "restaurant not found" });
    }

    // ensure item belongs to this restaurant
    if (!rest.items.includes(itemId)) {
      return res
        .status(403)
        .json({ message: "item does not belong to your restaurant" });
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        description,
        category,
        price,
        isVeg,
        discountPercent,
        ...(image && { image }), // only update image if new one exists
      },
      { new: true },
    );

    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `editing item error: ${error}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // find restaurant of logged-in owner
    const rest = await Restaurant.findOne({ owner: req.userId });
    if (!rest) {
      return res.status(400).json({ message: "restaurant not found" });
    }

    // ensure item belongs to this restaurant
    if (!rest.items.includes(itemId)) {
      return res
        .status(403)
        .json({ message: "item does not belong to your restaurant" });
    }

    // delete item
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    // remove item reference from restaurant
    rest.items.pull(itemId);
    await rest.save();

    return res.status(200).json({ message: "item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `deleting item error: ${error}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getting item by id error: ${error}` });
  }
};

export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Item.find({ category });

    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getting items by category error: ${error.message}` });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getting all items error: ${error}` });
  }
};

export const getItemByRestName = async (req, res) => {
  try {
    const { res_name } = req.params;
    const items = await Item.find()
      .populate({
      path: "restaurant",
      match: { name: { $regex: res_name, $options: "i" } },
      });
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getting items by restaurant name error: ${error}` });
  }
};

export const getItemByName = async (req, res) => {
  try {
    // const { name } = req.params;  -> no need query does work just for api showing
    
    const { query, city } = req.query; // city filter from frontend query

    // find items matching name and populate restaurant to filter by city
    const items = await Item.find({ name: { $regex: query , $options: "i" } })
      .populate({
        path: "restaurant",
        match: { city },
      });
    
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getting items by name error: ${error}` });
  }
};
