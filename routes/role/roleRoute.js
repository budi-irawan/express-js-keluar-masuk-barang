const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/otorisasi' );
const roleController = require( '../../controllers/role' );

router.post( '/', roleController.create );
router.get( '/', authentification.cekLogin, authorization.isManager, roleController.read );
router.put( '/:id', authentification.cekLogin, authorization.isManager, roleController.update );
router.delete( '/:id', authentification.cekLogin, authorization.isManager, roleController.delete );

module.exports = router;