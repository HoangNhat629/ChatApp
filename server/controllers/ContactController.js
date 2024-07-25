const User = require("../models/AuthModel");
const Message = require("../models/MessageModel");
const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send({ msg: "Search term is required" });
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const getContactsForDMList = async (req, res) => {
  try {
    let userId = req.user._id;
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: {
          timestamps: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamps" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const getAllContacts = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      "firstName lastName _id email"
    );
    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id
    }));
    return res.status(200).json({ contacts });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
module.exports = {
  searchContacts,
  getContactsForDMList,
  getAllContacts,
};
