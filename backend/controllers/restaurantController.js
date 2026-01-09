import uploadOnCloudinary from "../config/cloudinary.js";
import Restaurant from "../models/restaurant.models.js";

export const createEditRest = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

 
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }


    let image;

    // upload image if exists
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // find restaurant by owner
    let rest = await Restaurant.findOne({ owner: req.userId });

    // CREATE restaurant when none exists
    if (!rest) {
      rest = await Restaurant.create({
        name,
        city,
        state,
        address,
        ...(image && { image }),
        owner: req.userId,
      });
    } else {
      // UPDATE restaurant when one exists
      rest = await Restaurant.findByIdAndUpdate(
        rest._id,
        {
          name,
          city,
          state,
          address,
          ...(image && { image }), // update image only if exists
        },
        { new: true } // return updated document
      );
    }

    await rest.populate("owner items");

    return res.status(201).json({
      success: true,
      message: "Restaurant created/updated successfully",
      rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Create/Edit restaurant error: ${error.message}`,
    });
  }
};

export const getMyRest = async (req, res) => {
  try {
    const rest = await Restaurant.findOne({ owner: req.userId })
    .populate(
      "owner "
    ).populate({ path: 'items', options: { sort: { updatedAt: -1 } } });

    if (!rest) {
      return null;
    }
    return res.status(200).json(rest);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get my restaurant error ${error}` });
  }
};
