const jwt = require( 'jsonwebtoken' );

class Authentification {
	static async cekLogin( req, res, next ) {
		const {
			token
		} = req.headers;

		if ( !token ) {
			res.status( 400 ).send( {
				error: "token tidak ada"
			} )
		} else {
			jwt.verify( token, 'secret', ( err, decoded ) => {
				if ( err ) {
					res.status( 400 ).send( {
						error: "token tidak valid"
					} )
				} else {
					req.user = decoded;
					next();
				}
			} )
		}
	}
}

module.exports = Authentification;