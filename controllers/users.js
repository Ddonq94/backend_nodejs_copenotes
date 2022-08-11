const uuid = require("uuid");
const { validate, getAllUsers, addNewUser } = require("../helpers");

const getAll = (req, res) => {
  res.json({ users: getAllUsers(), status: "success" });
};

const getOne = (req, res) => {
  res.json({ details: "one user" });
};

const add = (req, res) => {
  let validation = validate(req.body);
  if (validation.valid) {
    let id = uuid.v4();

    let { name, email } = req.body;

    let user = { id, name, email, sentMessages: [] };

    addNewUser(user);

    res.status(201).json({ user, status: validation.message });
  } else {
    res.status(201).json({ status: validation.message });
  }
};

const edit = (req, res) => {
  res.json({ details: "edit user" });
};

const deleteUser = (req, res) => {
  res.json({ details: "Delete user" });
};

module.exports = {
  getAll,
  getOne,
  add,
  edit,
  deleteUser,
};
