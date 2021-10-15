const BarangMasukModel = require( '../models' ).BarangMasuk;
const BarangModel = require( '../models' ).Barang;
const UserModel = require( '../models' ).User;
const HelperJwt = require( '../helper/jwt' );
// const Redis = require( '../config/redisConfig' );
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class BarangMasuk {
	static create( req, res ) {
		HelperJwt.cekToken( req.headers.token, ( err, user ) => {
			if ( err ) {
				return res.status( 200 ).send( {
					pesan: 'token tidak valid'
				} )
			} else {
				// console.log( user );
				return BarangModel
					.findOne( {
						where: {
							nama_barang: req.body.nama_barang
						}
					} )
					.then( barang => {
						if ( !barang ) {
							return res.status( 200 ).send( {
								pesan: 'barang belum ada'
							} )
						}
						// console.log( barang );
						const qty = parseInt( barang.stok );
						const qty2 = parseInt( req.body.jumlah )
						return barang
							.update( {
								stok: qty + qty2
							} )
							.then( barang => {
								return BarangMasukModel
									.create( {
										id_barang: barang.id,
										jumlah_masuk: req.body.jumlah,
										id_user: user.id
									} )
									.then( barangmasuk => {
										return res.status( 201 ).send( barangmasuk )
									} )
									.catch( error => res.status( 500 ).send( error ) )
							} )
							.catch( error => res.status( 500 ).send( error ) )
					} )
					.catch( error => res.status( 500 ).send( error ) )
			}
		} )
	}

	static async read( req, res ) {
		try {
			const barangMasuk = await db.sequelize.query( `
				select "BarangMasuks"."id","Barangs"."nama_barang","BarangMasuks"."jumlah_masuk","Users"."nama" as "nama_user"
				from "BarangMasuks"
				join "Barangs" on "Barangs"."id"="BarangMasuks"."id_barang"
				join "Users" on "Users"."id"="BarangMasuks"."id_user";` );
			res.status( 200 ).json( barangMasuk[ 0 ] );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async readByUser( req, res ) {
		const {
			id
		} = req.params;
		let response;
		try {
			const barangMasuk = await db.sequelize.query( `
				select "BarangMasuks"."id","Barangs"."nama_barang","BarangMasuks"."jumlah_masuk"
				from "BarangMasuks"
				join "Barangs" on "Barangs"."id"="BarangMasuks"."id_barang"
				join "Users" on "Users"."id"="BarangMasuks"."id_user"
				where "BarangMasuks"."id_user"=${id};` );

			if ( req.user.id == id ) {
				if ( barangMasuk[ 0 ].length > 0 ) {
					response = barangMasuk[ 1 ].rows
				} else {
					response = {
						"message": "belum ada input"
					};
				}
			} else {
				response = {
					"message": "unauthorized"
				};
			}
			res.status( 200 ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}
}

module.exports = BarangMasuk;