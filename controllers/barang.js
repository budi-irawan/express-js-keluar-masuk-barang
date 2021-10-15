const sharp = require( 'sharp' );
const path = require( 'path' );
// const redis = require( 'redis' );
const BarangModel = require( '../models' ).Barang;
const Gambar = require( '../models' ).Gambar;
const PemasokModel = require( '../models' ).Pemasok;
// const Redis = require( '../config/redisConfig' );
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );
const Op = Sequelize.Op;
// const redisPort = 6379;
// const client = redis.createClient( redisPort );
// client.on( "error", ( err ) => {
// 	console.log( err );
// } );

class BarangController {
	static create( req, res ) {
		const {
			nama_barang,
			harga_beli,
			harga_jual,
			satuan,
			stok,
			nama_pemasok
		} = req.body;

		if ( !nama_barang || !harga_beli || !harga_jual || !satuan || !stok || !nama_pemasok ) {
			return res.status( 200 ).send( {
				pesan: 'field harus diisi'
			} );
		};
		if ( isNaN( harga_beli ) || isNaN( harga_jual ) || isNaN( stok ) ) {
			return res.status( 200 ).send( {
				pesan: 'field harus angka'
			} );
		};
		return PemasokModel
			.findOne( {
				where: {
					nama_pemasok: req.body.nama_pemasok
				}
			} )
			.then( pemasok => {
				// console.log( pemasok );
				if ( pemasok ) {
					return BarangModel
						.create( {
							nama_barang: req.body.nama_barang,
							harga_beli: req.body.harga_beli,
							harga_jual: req.body.harga_jual,
							satuan: req.body.satuan,
							stok: req.body.stok,
							id_pemasok: pemasok.id
						} )
						.then( barang => {
							console.log( req );
							for ( var i = 0; i < req.files.length; i++ ) {
								const filename = req.files[ i ].originalname.replace( /\..+$/, '' );
								const newFilename = `produk-${filename}-${Date.now()}.png`;
								sharp( req.files[ i ].path )
									.resize( 144, 144 )
									.png( {
										quality: 90
									} )
									.toFile( path.join( __dirname, '../', 'public', 'produk', newFilename ), ( err, info ) => {
										if ( err ) {
											console.log( err );
										} else {
											console.log( `image cropped` );
										}
									} );
								Gambar.bulkCreate( [ {
										nama_file: newFilename,
										id_barang: barang.id
									} ], {
										returning: false
									} )
									.then( () => {
										console.log( ` Menyimpan gambar ${newFilename} ...` );
									} )
									.catch( err => console.log( err ) );
							}
							res.status( 201 ).send( barang );
						} )
						.catch( error => res.status( 500 ).send( error ) );

				} else {
					res.status( 200 ).send( {
						pesan: 'pemasok tidak ditemukan'
					} )
				}
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static async read( req, res ) {
		try {
			const barang = await BarangModel.findAll( {
				include: [ {
						model: PemasokModel,
						as: 'pemasok'
					},
					{
						model: Gambar,
						as: 'gambar'
					}
				]
			} );
			res.status( 200 ).json( barang );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static update( req, res ) {
		return BarangModel
			.findByPk( req.params.id )
			.then( barang => {
				if ( !barang ) {
					return res.status( 200 ).send( {
						pesan: 'barang tidak ada'
					} )
				}

				return PemasokModel
					.findOne( {
						where: {
							nama_pemasok: req.body.nama_pemasok
						}
					} )
					.then( pemasok => {
						if ( pemasok ) {
							return barang
								.update( {
									nama_barang: req.body.nama_barang,
									harga_beli: req.body.harga_beli,
									harga_jual: req.body.harga_jual,
									stok: req.body.stok,
									satuan: req.body.satuan,
									id_pemasok: pemasok.id
								} )
								.then( barang => {
									Gambar.destroy( {
											where: {
												id_barang: barang.id
											}
										} )
										.then( () => console.log( 'delete' ) )
										.catch( err => res.status( 500 ).send( err ) );
									for ( var i = 0; i < req.files.length; i++ ) {
										const filename = req.files[ i ].originalname.replace( /\..+$/, '' );
										const newFilename = `produk-${filename}-${Date.now()}.png`;
										sharp( req.files[ i ].path )
											.resize( 144, 144 )
											.png( {
												quality: 90
											} )
											.toFile( path.join( __dirname, '../', 'public', 'produk', newFilename ), ( err, info ) => {
												if ( err ) {
													console.log( err );
												} else {
													console.log( `gambar telah dioptimasi ...` );
												}
											} );
										Gambar.bulkCreate( [ {
												nama_file: newFilename,
												id_barang: barang.id
											} ], {
												returning: false
											} )
											.then( () => {
												console.log( ` Memperbarui gambar ${newFilename} ...` );
											} )
											.catch( err => console.log( err ) );
									}
									res.status( 201 ).send( barang )
								} )
								.catch( error => res.status( 500 ).send( error ) )
						} else {
							res.status( 200 ).send( {
								pesan: 'pemasok tidak ditemukan'
							} )
						}
					} )
					.catch( error => res.status( 500 ).send( error ) )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static delete( req, res ) {
		return BarangModel
			.findByPk( req.params.id )
			.then( barang => {
				if ( !barang ) {
					return res.status( 200 ).send( {
						pesan: 'barang tidak ada'
					} )
				}
				return barang
					.destroy()
					.then( barang => {
						Gambar.destroy( {
								where: {
									id_barang: req.params.id
								}
							} )
							.then( () => console.log( 'gambar dihapus' ) )
							.catch( err => res.status( 500 ).send( err ) )
						res.status( 200 ).send( {
							pesan: 'barang telah dihapus'
						} )
					} )
					.catch( error => res.status( 500 ).send( error ) )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	// static search( req, res ) {
	// 	const redisPort = 6379;
	// 	const client = redis.createClient( redisPort );
	// 	client.on( "error", ( err ) => {
	// 		console.log( err );
	// 	} );
	// 	const {
	// 		cari
	// 	} = req.query;
	// 	const redis_key = cari;
	// 	try {
	// 		client.get( redis_key, async ( err, reply ) => {
	// 			if ( err ) throw err;
	// 			if ( reply ) {
	// 				res.status( 200 ).send( {
	// 					pesan: 'Data dari cache',
	// 					data: JSON.parse( reply )
	// 				} )
	// 			} else {
	// 				const barang = await BarangModel.findAll( {
	// 					include: [ {
	// 						model: PemasokModel,
	// 						as: 'pemasok'
	// 					}, {
	// 						model: Gambar,
	// 						as: 'gambar'
	// 					} ],
	// 					where: {
	// 						nama_barang: {
	// 							[ Op.like ]: '%' + cari + '%'
	// 						}
	// 					}
	// 				} );
	// 				if ( barang.length == 0 ) {
	// 					res.status( 200 ).send( {
	// 						pesan: 'barang tidak ditemukan'
	// 					} )
	// 				} else {
	// 					client.setex( redis_key, 600, JSON.stringify( barang ) );
	// 					res.status( 200 ).send( {
	// 						pesan: 'Data dari database',
	// 						data: barang,
	// 					} )
	// 				}
	// 			}
	// 		} )
	// 	} catch ( e ) {
	// 		res.status( 500 ).send( {
	// 			pesan: e.message
	// 		} )
	// 	}
	// }
}

module.exports = BarangController;