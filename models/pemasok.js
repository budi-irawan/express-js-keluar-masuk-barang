'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class Pemasok extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			Pemasok.hasMany( models.Barang, {
				foreignKey: 'id_pemasok',
				as: 'barang'
			} )
		}
	};
	Pemasok.init( {
		nama_pemasok: DataTypes.STRING,
		alamat: DataTypes.TEXT,
		email: DataTypes.STRING,
		phone: DataTypes.STRING
	}, {
		sequelize,
		modelName: 'Pemasok',
	} );
	return Pemasok;
};