require( "dotenv" ).config();
const passport = require( "passport" )
const Customer = require( '../models' ).Customer;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use( new GoogleStrategy( {
		clientID: "960041261376-0if5eb0vot418regdp38af26ehubu3nm.apps.googleusercontent.com",
		clientSecret: "qsH0sm1-TTOAaRn0Qiw9OoT7",
		callbackURL: "http://localhost:3000/inventory/api/customer/google/callback",
		passReqToCallback: true
	},
	( request, accessToken, refreshToken, profile, done ) => {
		const email = profile.emails[ 0 ].value;
		// console.log( email );

		return Customer
			.findOne( {
				where: {
					email: email,
				}
			} )
			.then( customer => {
				// console.log( customer );
				return done( null, customer );
			} )
			.catch( error => console.log( error ) );
	}
) );