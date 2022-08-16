const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtsController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', ToughtController.showToughts)
router.get('/dashboard', checkAuth, ToughtController.showDashboard)
router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtSave)
router.post('/remove', checkAuth, ToughtController.removeTought)
router.get('/edit/:id', checkAuth, ToughtController.updateTought)
router.post('/edit', checkAuth, ToughtController.updateToughtSave)




module.exports = router