const express = require( 'express' );
const router = express.Router();
const passport = require( 'passport' );
require( '../../helper/passportAuthentication' );

const authentifikasi = require( '../../middleware/authentification' );
const authorisasi = require( '../../middleware/otorisasi' );
const customerController = require( '../../controllers/customer' );

router.post( '/register', customerController.register );
router.post( '/login', customerController.login );
router.get( '/:id/profile', authentifikasi.cekLogin, customerController.getProfile );
router.get( '/:id/riwayat-transaksi', authentifikasi.cekLogin, customerController.riwayatTransaksi );
router.post( '/lupa-password', customerController.lupaPassword );
router.put( '/ubah-password/:token', customerController.resetPassword );
router.put( '/aktivasi/:confirmation_code', customerController.verifikasi );
router.get( '/', customerController.getAllCustomers );
router.get( '/cari', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, customerController.search );
router.delete( '/:id', authentifikasi.cekLogin, authorisasi.isAdminPenjualan, customerController.delete );
// router.get( '/google', passport.authenticate( 'google', {
// 	scope: [ "profile", "email" ]
// } ) );
// router.get( '/google/callback', passport.authenticate( 'google', {
// 	session: false,
// 	failureRedirect: '/google'
// } ), customerController.loginGoogle );

module.exports = router;