const express = require( 'express' );
const router = express.Router();

const roleRoute = require( './role/roleRoute' );
const userRoute = require( './user/userRoute' );
const barangRoute = require( './barang/barangRoute' );
const pemasokRoute = require( './pemasok/pemasokRoute' );
const barangmasukRoute = require( './barangmasuk/barangmasukRoute' );
// const barangkeluarRoute = require( './barangkeluar/barangkeluarRoute' );
const customerRoute = require( './customer/customerRoute' );

router.use( '/api/role', roleRoute );
router.use( '/api/users', userRoute );
router.use( '/api/barang', barangRoute );
router.use( '/api/pemasok', pemasokRoute );
router.use( '/api/barang-masuk', barangmasukRoute );
// router.use( '/api/barang-keluar', barangkeluarRoute );
router.use( '/api/customers', customerRoute );

module.exports = router;