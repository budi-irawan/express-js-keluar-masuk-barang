'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class Gambar extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			Gambar.belongsTo( models.Barang, {
				foreignKey: 'id_barang',
				as: 'barang'
			} )
		}
	};
	Gambar.init( {
		nama_file: DataTypes.STRING,
		id_barang: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'Gambar',
	} );
	return Gambar;
};