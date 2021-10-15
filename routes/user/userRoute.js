const express = require( 'express' );
const router = express.Router();

const authentifikasi = require( '../../middleware/authentification' );
const authorisasi = require( '../../middleware/otorisasi' );
const userController = require( '../../controllers/user' );
const barangMasukController = require( '../../controllers/barangmasuk' );

router.post( '/register', userController.register );
router.post( '/login', userController.login );
router.get( '/:id/profile', authentifikasi.cekLogin, userController.getProfile );
router.post( '/lupa-password', userController.lupaPassword );
router.put( '/ubah-password/:token', userController.resetPassword );
router.put( '/aktivasi/:confirmation_code', userController.verifikasi );
router.get( '/', userController.getAllUsers );
router.get( '/:id/riwayat-input', authentifikasi.cekLogin, authorisasi.isAdminGudang, barangMasukController.readByUser );
router.delete( '/:id', authentifikasi.cekLogin, authorisasi.isManager, userController.delete );

module.exports = router;