const UserModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

// Get All Users
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  try {
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get User Info
module.exports.userInfo = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  UserModel.findById(req.params.id, (err, user) => {
    if (!err) {
      res.status(200).json(user);
    } else {
      console.log("ID Unknown " + err);
      res.status(500).json(err);
    }
  }).select("-password");
};

// Update User
module.exports.updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(500).json(err));
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete User
module.exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  try {
    await UserModel.findByIdAndRemove(req.params.id).exec();
    res.status(200).json("User Successfully deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Follow User
module.exports.follow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToFollow)
  )
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json(err))
    );

    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json(err))
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

// Unfollow User
module.exports.unfollow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json(err))
    );

    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json(err))
    );
  } catch (err) {
    res.status(500).json(err);
  }
};
