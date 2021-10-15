// require( "dotenv" ).config();
// const RedisClient = require( 'redis' ).createClient;
// const RedisCon = RedisClient( process.env.REDIS_PORT, process.env.REDIS_HOST );
//
// function get( redis_key ) {
// 	return new Promise( ( resolve ) => {
// 		RedisCon.get( redis_key, ( err, reply ) => {
// 			if ( err ) {
// 				console.log( "Redis : ", err );
// 			} else {
// 				console.log( "Ambil data dari cache : ", redis_key );
// 				resolve( {
// 					reply
// 				} );
// 			}
// 		} );
// 	} );
// }
//
// function set( redis_key, redis_value ) {
// 	console.log( "Memasukkan data ke dalam cache ==================> : ", redis_key, redis_value );
// 	RedisCon.set( redis_key, redis_value )
// }
//
// module.exports.get = get;
// module.exports.set = set;