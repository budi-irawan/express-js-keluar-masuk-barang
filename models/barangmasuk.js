'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class BarangMasuk extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			BarangMasuk.belongsTo( models.User, {
				foreignKey: 'id_user',
				as: 'user'
			} );

			BarangMasuk.belongsTo( models.Barang, {
				foreignKey: 'id_barang',
				as: 'barang'
			} )
		}
	};
	BarangMasuk.init( {
		id_barang: DataTypes.INTEGER,
		jumlah_masuk: DataTypes.INTEGER,
		id_user: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'BarangMasuk',
	} );
	return BarangMasuk;
};