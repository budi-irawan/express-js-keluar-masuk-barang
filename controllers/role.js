const RoleModel = require( '../models' ).Role;

class RoleController {
	static async create( req, res ) {
		try {
			const {
				nama_role
			} = req.body;
			const objRole = {
				nama_role
			};
			const role = await RoleModel.create( objRole );
			res.status( 201 ).send( role )
		} catch ( e ) {
			res.status( 400 ).send( e );
		}
	}

	static async read( req, res ) {
		try {
			const role = await RoleModel.findAll();
			console.log( role.length );
			return res.status( 200 ).send( role );
		} catch ( e ) {
			return res.status( 400 ).send( e );
		}
	}

	static update( req, res ) {
		return RoleModel
			.findByPk( req.params.id )
			.then( role => {
				if ( !role ) {
					return res.status( 200 ).send( {
						pesan: 'role tidak ada'
					} )
				}
				return role
					.update( {
						nama_role: req.body.nama_role
					} )
					.then( role => res.status( 201 ).send( role ) )
					.catch( error => res.status( 500 ).send( error ) )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}

	static delete( req, res ) {
		return RoleModel
			.findByPk( req.params.id )
			.then( role => {
				if ( !role ) {
					return res.status( 200 ).send( {
						pesan: 'role tidak ada'
					} )
				}
				return role
					.destroy()
					.then( role => res.status( 200 ).send( {
						pesan: 'role telah dihapus'
					} ) )
					.catch( error => res.status( 500 ).send( error ) )
			} )
			.catch( error => res.status( 500 ).send( error ) )
	}
}

module.exports = RoleController;