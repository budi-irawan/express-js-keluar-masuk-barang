const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const sendEmail = require( '../helper/kirimEmail' );
const validEmail = require( '../helper/validEmail' );
const db = require( '../models' );
const userModel = require( '../models' ).User;
const roleModel = require( '../models' ).Role;
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );
const Op = Sequelize.Op;

class UserController {
	static async register( req, res ) {
		const {
			nama,
			email,
			password,
			nama_role
		} = req.body;

		try {
			let response;
			let statusCode;
			let errors = {};

			if ( !nama ) {
				errors.nama = "nama harus diisi";
			}

			if ( !email ) {
				errors.email = "email harus diisi";
			} else if ( validEmail.isEmailValid( email ) == false ) {
				errors.email = "format email tidak valid";
			} else {
				const emailExist = await userModel.findOne( {
					where: {
						email: email
					}
				} );
				if ( emailExist ) {
					errors.email = "email sudah terdaftar";
				}
			}

			if ( !password ) {
				errors.password = "password harus diisi";
			} else if ( !/^\S*$/.test( password ) ) {
				errors.password = "password tidak boleh mengandung spasi";
			} else if ( !/^(?=.*[A-Z]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 huruf besar"
			} else if ( !/^(?=.*[a-z]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 huruf kecil"
			} else if ( !/^(?=.*[0-9]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 angka"
			} else if ( !/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 karakter spesial"
			} else if ( !/^.{6,}$/.test( password ) ) {
				errors.password = "password minimal 6 karakter"
			}

			let roleId;
			if ( !nama_role ) {
				errors.nama_role = "role harus diisi";
			} else {
				const role = await roleModel.findOne( {
					where: {
						nama_role: nama_role
					}
				} );
				if ( !role ) {
					errors.nama_role = "role tidak ada";
				} else {
					roleId = role.id;
				}
			}

			if ( Object.entries( errors ).length == 0 ) {
				const passwordHash = await bcrypt.hash( password, 10 );
				const tokenVerification = await jwt.sign( {
					email: email
				}, 'secret' );
				const user = await userModel.create( {
					nama: nama,
					email: email,
					password: passwordHash,
					status: false,
					id_role: roleId,
					confirmation_code: tokenVerification,
					reset_token: null,
					expire_token: null
				} );
				sendEmail.sendEmailVerification( user.email, user.confirmation_code );
				statusCode = 200;
				response = user;
			} else {
				statusCode = 400;
				response = errors;
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async login( req, res ) {
		const {
			email,
			password
		} = req.body;

		try {
			let errors = {};
			let response = {};
			let statusCode;
			let token;

			const user = await userModel.findOne( {
				where: {
					email: email
				}
			} );

			if ( !email ) {
				errors.email = "field email harus diisi";
			} else if ( validEmail.isEmailValid( email ) == false ) {
				errors.email = "format email tidak valid";
			} else if ( !user ) {
				errors.email = "email belum terdaftar";
			} else if ( user.status == false ) {
				errors.email = "anda belum verifikasi email";
			} else if ( !password ) {
				errors.password = "field password harus diisi";
			} else {
				const match = await bcrypt.compare( password, user.password );
				if ( !match ) {
					errors.password = "password salah";
				} else {
					token = await jwt.sign( {
						id: user.id,
						email: user.email
					}, 'secret' );
				}
			}

			if ( Object.entries( errors ).length == 0 ) {
				statusCode = 200;
				response.status = 'success';
				response.data = {
					token: token
				};
			} else {
				statusCode = 400;
				response.error = errors;
			}

			res.status( statusCode ).send( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async getAllUsers( req, res ) {
		try {
			// const data = await db.sequelize.query( 'SELECT * FROM "Customers" ;', {
			// 	type: QueryTypes.SELECT
			// } );
			const data = await userModel.findAll();
			let result;
			let statusCode;
			if ( data.length > 0 ) {
				result = data;
			} else {
				result = "belum ada data";
			}
			const response = {
				status: 'success',
				data: result
			}
			res.send( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async getProfile( req, res ) {
		const {
			id
		} = req.params;
		let response = {};
		let statusCode;
		try {
			const user = await userModel.findOne( {
				where: {
					id: id
				}
			} );

			if ( !user ) {
				statusCode = 400;
				response.account = "akun anda belum terdaftar"
			} else {
				if ( req.user.id == id ) {
					statusCode = 200;
					response = user;
				} else {
					statusCode = 403;
					response.message = "unauthorized";
				}
			}
			res.status( statusCode ).send( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async verifikasi( req, res ) {
		const {
			confirmation_code
		} = req.params;

		let errors = {};
		let response = {};
		let statusCode;
		try {
			const user = await userModel.findOne( {
				where: {
					confirmation_code: confirmation_code
				}
			} );

			if ( !user ) {
				errors.confirmation_code = "kode verifikasi tidak valid";
			} else {
				await user.update( {
					status: true
				} );
			}

			if ( Object.entries( errors ).length == 0 ) {
				statusCode = 200;
				response.data = {
					"status_akun": "sudah melakukan verifikasi"
				};
			} else {
				statusCode = 400;
				response.error = errors;
			}

			res.status( statusCode ).send( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async lupaPassword( req, res ) {
		const {
			email
		} = req.body;

		let errors = {};
		let response = {};
		let statusCode;

		try {
			if ( !email ) {
				errors.email = "masukkan email anda";
			} else {
				const user = await userModel.findOne( {
					where: {
						email: email
					}
				} );

				if ( !user ) {
					errors.email = "email belum terdaftar";
				} else {
					const tokenReset = await jwt.sign( {
						email: user.email
					}, 'secret' );
					await user.update( {
						reset_token: tokenReset,
						expire_token: Date.now() + 3600000
					} );
				}
			}

			if ( Object.entries( errors ).length == 0 ) {
				statusCode = 200;
				response.status = 'success';
				response.data = {
					pesan: "cek email untuk pengaturan ulang password"
				};
				response.error = errors;
			} else {
				statusCode = 400;
				response.status = 'client error';
				response.data = null;
				response.error = errors;
			}

			res.status( statusCode ).send( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async resetPassword( req, res ) {
		const {
			password
		} = req.body;
		const {
			token
		} = req.params;

		let errors = {};
		let response = {};
		let statusCode;

		try {
			const user = await userModel.findOne( {
				where: {
					reset_token: token
				}
			} );

			if ( !password ) {
				errors.password = "field password harus diisi";
			} else if ( password.length < 6 ) {
				errors.password = "password minimal 6 karakter";
			}

			if ( Object.entries( errors ).length == 0 ) {
				const passwordHash = await bcrypt.hash( password, 10 );
				await user.update( {
					password: passwordHash,
					reset_token: null,
					expire_token: null
				} );

				statusCode = 200;
				response.status = 'success';
				response.data = "password telah direset";
				response.error = errors;
			} else {
				statusCode = 400;
				response.status = 'client error';
				response.data = null;
				response.error = errors;
			}
			res.status( statusCode ).send( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async search( req, res ) {
		const {
			nama
		} = req.query;

		let errors = {};
		let response = {};
		let statusCode;

		try {
			if ( !nama ) {
				errors.nama = "masukkan nama customer";
			} else {
				const user = await userModel.findAll( {
					where: {
						nama: {
							[ Op.like ]: '%' + nama + '%'
						}
					}
				} );

				let rows;
				if ( user.length > 0 ) {
					rows = user;
				} else {
					errors.nama = "data tidak ditemukan"
				}

				if ( Object.entries( errors ).length == 0 ) {
					statusCode = 200;
					response.status = 'success';
					response.data = rows;
					response.error = errors;
				} else {
					statusCode = 400;
					response.status = 'client error';
					response.data = null;
					response.error = errors;
				}
			}

			res.status( statusCode ).send( response );
		} catch ( e ) {
			res.status( 500 ).send( "server error" );
			console.log( e.message );
		}
	}

	static async delete( req, res ) {
		const {
			id
		} = req.params;

		let errors = {};
		let response = {};
		let statusCode;

		try {
			const user = await userModel.destroy( {
				where: {
					id: id
				}
			} );

			let rows;
			if ( user ) {
				rows = "data berhasil dihapus";
			} else {
				errors.rows = "data tidak ada";
			}

			if ( Object.entries( errors ).length == 0 ) {
				statusCode = 200;
				response.status = 'success';
				response.data = rows;
				response.error = errors;
			} else {
				statusCode = 400;
				response.status = 'client error';
				response.data = null;
				response.error = errors;
			}

			res.status( statusCode ).send( response );
		} catch ( e ) {
			res.status( 500 ).send( "server error" );
			console.log( e.message );
		}
	}

	static async riwayatTransaksi( req, res ) {
		const {
			id
		} = req.params;
		let response;
		try {
			const transaction = await db.sequelize.query( `
	      select "BarangKeluars"."id","Barangs"."nama_barang","BarangKeluars"."jumlah","BarangKeluars"."total_bayar"
	      from "BarangKeluars"
	      join "Barangs" on "Barangs"."id"="BarangKeluars"."id_barang"
	      where "BarangKeluars"."id_customer"=${id};` );

			if ( req.user.id == id ) {
				if ( transaction[ 0 ].length > 0 ) {
					response = transaction[ 1 ].rows
				} else {
					response = {
						"message": "belum ada catatan transaksi"
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

module.exports = UserController;