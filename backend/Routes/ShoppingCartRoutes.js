const express = require('express')
const router=express.Router()
const ShoppingController = require("../Controllers/ShoppingCartController")

router.get('/cart/all',ShoppingController.get)
router.post('/cart/save',ShoppingController.save)
router.post('/cart/update',ShoppingController.update)
router.post('/cart/delete',ShoppingController.deleteAll)
router.post('/cart/deleteone',ShoppingController.deleteOne)
router.get('/cart/:id/:username',ShoppingController.findone)
router.get('/cart/user',ShoppingController.findmany)
router.post('/pay/card/:cartId',ShoppingController.order)
router.post('/cart/address/:id',ShoppingController.address)
router.get('/cart/history',ShoppingController.history)
router.post('/Cash/:cartId',ShoppingController.Cash)
router.get('/admin/Monthlyrevenue',ShoppingController.Monthlyrevenue)
router.get('/admin/Dailyrevenue',ShoppingController.DailyRevenue)
router.get('/admin/ProductsQuantity',ShoppingController.ProductsQuantity)

module.exports = router;