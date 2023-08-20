const express = require('express')
const router=express.Router()
const OrderController = require("../Controllers/OrderController")

router.get('/Order/all',OrderController.get)
router.post('/Order/save',OrderController.save)
router.post('/Order/update',OrderController.update)
router.post('/Order/delete',OrderController.delete)
router.get('/Order/history',OrderController.History)
router.get('/Order/:orderby',OrderController.findmany)
router.get('/Order/:orderby/:id',OrderController.findone)





module.exports = router;