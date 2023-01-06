const { getAppInfo, getMostRated } = require("../controllers/admin");
const { isAuth } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/app-info", isAuth, isAuth, getAppInfo);
router.get("/most-rated", isAuth, isAuth, getMostRated);

module.exports = router;
