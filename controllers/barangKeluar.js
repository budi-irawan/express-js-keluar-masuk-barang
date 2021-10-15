// const HelperJwt = require( '../helper/jwt' );
// const BarangModel = require( '../models' ).Barang;
// const Customer = require( '../models' ).Customer;
// const BarangKeluarModel = require( '../models' ).BarangKeluar;
// // const Redis = require( '../config/redisConfig' );
// const Bull = require( 'bull' );
// const db = require( '../models' );
// const {
// 	Sequelize,
// 	QueryTypes
// } = require( 'sequelize' );
//
// const antrian = new Bull( 'antrian' );
// antrian.on( 'completed', ( job, result ) => {
// 	console.log( `Job : ${result}` );
// } );
//
// antrian.on( 'failed', ( job, result ) => {
// 	console.log( `Job : ${result}` );
// } );
// antrian.process( async ( job, done ) => {
// 	console.log( job.data );
// 	BarangModel.findOne( {
// 			where: {
// 				nama_barang: job.data.nama_barang
// 			}
// 		} )
// 		.then( barang => {
// 			// console.log( barang );
// 			if ( barang ) {
// 				if ( barang.stok >= job.data.jumlah ) {
// 					let sisa = barang.stok - job.data.jumlah;
// 					return barang.update( {
// 							stok: sisa
// 						} )
// 						.then( barang => {
// 							done( null, `Berhasil memesan ${job.data.jumlah} barang` );
// 							return BarangKeluarModel
// 								.create( {
// 									id_customer: job.data.idCustomer,
// 									id_barang: barang.id,
// 									jumlah: job.data.jumlah,
// 									total_bayar: barang.harga_jual * job.data.jumlah,
// 									status: false
// 								} )
// 								.then( barangkeluar => {
// 									done( null )
// 								} )
// 								.catch( error => console.log( error ) )
// 						} )
// 						.catch( error => console.log( error ) )
// 				} else {
// 					done( null, `Stok barang tinggal ${barang.stok}` )
// 				}
// 			} else {
// 				done( null, 'Barang belum ada' )
// 			}
// 		} )
// 		.catch( error => console.log( error ) )
// } )
//
// function create( req, res ) {
// 	HelperJwt.cekToken( req.headers.token, ( err, decoded ) => {
// 		if ( err ) {
// 			console.log( err );
// 		} else {
// 			let idCustomer;
// 			Customer
// 				.findOne( {
// 					where: {
// 						email: decoded.email
// 					}
// 				} )
// 				.then( async customer => {
// 					if ( customer ) {
// 						idCustomer = customer.id;
// 						const nama_barang = req.body.nama_barang;
// 						const jumlah = parseInt( req.body.jumlah );
//
// 						let job = await antrian.add( {
// 							idCustomer: idCustomer,
// 							nama_barang: nama_barang,
// 							jumlah: jumlah
// 						} );
// 						let hasil = await job.finished();
// 						res.json( {
// 							pesan: hasil
// 						} );
// 					} else {
// 						res.status( 200 ).send( {
// 							pesan: 'Anda belum terdaftar'
// 						} )
// 					}
// 				} )
// 				.catch( error => res.status( 500 ).send( error ) )
// 		}
// 	} )
// }
//
// class BarangKeluar {
// 	static async read( req, res ) {
// 		try {
// 			const barangKeluar = await db.sequelize.query( `
// 				select "BarangKeluars"."id","Barangs"."nama_barang","BarangKeluars"."jumlah","BarangKeluars"."total_bayar","Customers"."nama" as "nama_customer","BarangKeluars"."createdAt"
// 				from "BarangKeluars"
// 				join "Barangs" on "Barangs"."id"="BarangKeluars"."id_barang"
// 				join "Customers" on "Customers"."id"="BarangKeluars"."id_customer";` );
// 			res.status( 200 ).json( barangKeluar[ 0 ] );
// 		} catch ( e ) {
// 			console.log( e.message );
// 		}
// 	}
// }
//
// module.exports = {
// 	BarangKeluar,
// 	create,
// };