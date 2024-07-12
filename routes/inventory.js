const express = require("express");
const router = express.Router();

router.get("/", item_controller.index);

module.exports = router;