const helperJwt = require( '../helper/jwt' );
const UserModel = require( '../models' ).User;
const RoleModel = require( '../models' ).Role;

class Otorisasi {
	static isAdminGudang( req, res, next ) {
		if ( req.headers.token ) {
			helperJwt.cekToken( req.headers.token, ( err, hasil ) => {
				if ( err ) {
					res.status( 200 ).send( {
						pesan: 'token tidak valid'
					} )
				} else {
					req.user = hasil;
					// console.log( hasil );
					return UserModel
						.findOne( {
							include: [ {
								model: RoleModel,
								as: 'role'
							} ],
							where: {
								email: hasil.email
							}
						} )
						.then( user => {
							console.log( user.role.nama_role );

							if ( user.role.nama_role === "admin gudang" || user.role.nama_role === "manager" ) {
								next();
							} else {
								res.status( 403 ).send( {
									pesan: 'Anda tidak bisa mengakses halaman ini'
								} )
							};

						} )
						.catch( error => res.status( 500 ).send( error ) )
				}
			} )
		} else {
			res.status( 200 ).send( {
				pesan: 'token tidak ada'
			} )
		}
	}

	static isAdminPenjualan( req, res, next ) {
		if ( req.headers.token ) {
			helperJwt.cekToken( req.headers.token, ( err, hasil ) => {
				if ( err ) {
					res.status( 200 ).send( {
						pesan: 'token tidak valid'
					} )
				} else {
					req.user = hasil;
					// console.log( hasil );
					return UserModel
						.findOne( {
							include: [ {
								model: RoleModel,
								as: 'role'
							} ],
							where: {
								email: hasil.email
							}
						} )
						.then( user => {
							console.log( user.role.nama_role );

							if ( user.role.nama_role === "admin penjualan" || user.role.nama_role === "manager" ) {
								next();
							} else {
								res.status( 403 ).send( {
									pesan: 'Anda tidak bisa mengakses halaman ini'
								} )
							};

						} )
						.catch( error => res.status( 500 ).send( error ) )
				}
			} )
		} else {
			res.status( 200 ).send( {
				pesan: 'token tidak ada'
			} )
		}
	}

	static isManager( req, res, next ) {
		if ( req.headers.token ) {
			helperJwt.cekToken( req.headers.token, ( err, hasil ) => {
				if ( err ) {
					res.status( 200 ).send( {
						pesan: 'token tidak valid'
					} )
				} else {
					req.user = hasil;
					// console.log( hasil );
					return UserModel
						.findOne( {
							include: [ {
								model: RoleModel,
								as: 'role'
							} ],
							where: {
								email: hasil.email
							}
						} )
						.then( user => {
							// console.log( user );

							if ( user.role.nama_role == "manager" ) {
								next();
							} else {
								res.status( 403 ).send( {
									pesan: 'Anda tidak bisa mengakses halaman ini'
								} )
							};

						} )
						.catch( error => res.status( 500 ).send( error ) )
				}
			} )
		} else {
			res.status( 200 ).send( {
				pesan: 'token tidak ada'
			} )
		}
	}
}

module.exports = Otorisasi;