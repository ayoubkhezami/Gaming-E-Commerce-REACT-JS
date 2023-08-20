const express = require('express')
const router=express.Router()
const GenreController = require("../Controllers/ContactController")

router.post('/contact',GenreController.contact)




module.exports = router;