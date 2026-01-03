import Item from "../models/items.models";
import Restaurant from "../models/restaurant.models";
import {uploadOnCloudinary} from "../config/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, description, category, price, isVeg, discountPercent } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const rest = await Restaurant.findOne({owner:req.userId})
    if(!rest){
        return res.status(400).json({message:"restaurant not founded"})
    }

    const item = await Item.create({
        name , description ,  category, price, isVeg, discountPercent , image , restaurant:restaurant._id
    })

    return res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ message: `add item error :${error}` });
  }
};


export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, description, category, price, isVeg, discountPercent } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(itemId,{
        name , description ,  category, price, isVeg, discountPercent , image
    },{new:true})

    if(!item){
        return res.status(400).json({message:"item not founded"})
    }

    return res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ message: `editing item error :${error}` });
  }
};