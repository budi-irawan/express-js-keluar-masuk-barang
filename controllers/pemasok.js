const PemasokModel = require( '../models' ).Pemasok;

class PemasokController {
	static create( req, res ) {
		const {
			nama_pemasok,
			alamat,
			email,
			phone
		} = req.body;
		PemasokModel
			.create( {
				nama_pemasok: nama_pemasok,
				alamat: alamat,
				email: email,
				phone: phone
			} )
			.then( pemasok => {
				res.status( 201 ).send( {
					status: 'OK',
					data: pemasok,
					errors: null
				} )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static read( req, res ) {
		PemasokModel
			.findAll()
			.then( pemasok => {
				if ( pemasok.length == 0 ) {
					res.status( 200 ).send( {
						pesan: 'belum ada pemasok'
					} )
				}
				res.status( 200 ).send( pemasok )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static update( req, res ) {
		PemasokModel
			.findByPk( req.params.id )
			.then( pemasok => {
				if ( !pemasok ) {
					res.status( 404 ).send( {
						pesan: 'tidak ada pemasok'
					} )
				}
				pemasok
					.update( {
						nama_pemasok: req.body.nama_pemasok,
						alamat: req.body.alamat,
						email: req.body.email,
						phone: req.body.phone
					} )
					.then( pemasok => res.status( 201 ).send( pemasok ) )
					.catch( error => res.status( 500 ).send( error ) )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static delete( req, res ) {
		PemasokModel
			.findByPk( req.params.id )
			.then( pemasok => {
				if ( !pemasok ) {
					res.status( 404 ).send( {
						pesan: 'tidak ada pemasok'
					} )
				}
				pemasok
					.destroy()
					.then( pemasok => res.status( 200 ).send( {
						pesan: 'pemasok berhasil dihapus'
					} ) )
					.catch( error => res.status( 500 ).send( error ) )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}
}

module.exports = PemasokController;