import uploadOnCloudinary from "../config/cloudinary.js";
import Restaurant from "../models/restaurant.models.js";


export const createEditRest = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let rest = await Restaurant.findOne({ owner: req.userId });

    if (!rest) {
      rest = await Restaurant.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      rest = await Restaurant.findByIdAndUpdate({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    }

    await rest.populate("owner");

    return res.status(201).json(rest);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `create restaurant error ${error}` });
  }
};


export const getMyRest = async (req,res) =>{
  try {
    const rest = await Restaurant.findOne({owner:req.userId}).populate("owner items")
    if(!rest){
      return null;
    }
    return res.status(200).json(rest);
  } catch (error) {
     return res
      .status(500)
      .json({ message: `get my restaurant error ${error}` });
  }
}