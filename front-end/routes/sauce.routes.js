const router = require("express").Router();
const sauceController = require("../controllers/sauce.controller");
const auth = require("../middleware/auth.middleware");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, sauceController.createSauce);
router.get("/", auth, sauceController.readAllSauces);
router.get("/:id", auth, sauceController.readOneSauce);
router.put("/:id", auth, multer, sauceController.updateSauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeSauce);

module.exports = router;
