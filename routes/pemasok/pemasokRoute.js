const express = require( 'express' );
const router = express.Router();

const authentifikasi = require( '../../middleware/authentification' );
const authorisasi = require( '../../middleware/otorisasi' );
const pemasokController = require( '../../controllers/pemasok' );

router.post( '/', pemasokController.create );
router.get( '/', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, pemasokController.read );
router.put( '/:id', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, pemasokController.update );
router.delete( '/:id', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, pemasokController.delete );

module.exports = router;