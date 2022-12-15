const { Router } = require("express");
const adminRouter = require("./admin/index");

const router = Router();

router.use("/admin", adminRouter);

module.exports = router;
