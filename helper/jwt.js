const jwt = require( 'jsonwebtoken' );

class HelperJwt {
	static buatToken( data, cb ) {
		var token = jwt.sign( data, 'secret' );
		cb( token );
	}

	static cekToken( token, cb ) {
		jwt.verify( token, 'secret', ( err, decoded ) => {
			if ( err ) {
				cb( err, null )
			} else {
				cb( null, decoded )
			}
		} )
	}
}

module.exports = HelperJwt;