const express = require('express')
const router=express.Router()
const GenreController = require("../Controllers/GenreController")

router.get('/genres/all',GenreController.get)
router.post('/Genre/save',GenreController.save)
router.post('/Genre/update',GenreController.update)
router.post('/Genre/delete',GenreController.delete)
router.get('/Genre/:name/:id',GenreController.findone)



module.exports = router;