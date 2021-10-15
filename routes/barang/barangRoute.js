const express = require( 'express' );
const router = express.Router();
const multer = require( 'multer' );
const authentifikasi = require( '../../middleware/authentification' );
const authorisasi = require( '../../middleware/otorisasi' );
const {
	upload,
	storage
} = require( '../../middleware/upload' );
const barangController = require( '../../controllers/barang' );

router.post( '/create', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, upload.array( 'gambar' ), barangController.create );
router.get( '/', barangController.read );
router.put( '/:id/details', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, upload.array( 'gambar' ), barangController.update );
router.delete( '/:id', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, barangController.delete );
// router.get( '/cari', barangController.search );

module.exports = router;