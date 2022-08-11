const express = require("express");
const router = express.Router();
const {
  getAll,
  getOne,
  add,
  edit,
  deleteUser,
} = require("../controllers/users");

router.route("/").get(getAll).post(add);
router.route("/:id").get(getOne).patch(edit).delete(deleteUser);

module.exports = router;
