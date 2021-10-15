'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class BarangKeluar extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			BarangKeluar.belongsTo( models.Customer, {
				foreignKey: 'id_customer',
				as: 'customer',
			} );

			BarangKeluar.belongsTo( models.Barang, {
				foreignKey: 'id_barang',
				as: 'barang',
			} );
		}
	};
	BarangKeluar.init( {
		id_customer: DataTypes.INTEGER,
		id_barang: DataTypes.INTEGER,
		jumlah: DataTypes.INTEGER,
		total_bayar: DataTypes.INTEGER,
		status: DataTypes.BOOLEAN
	}, {
		sequelize,
		modelName: 'BarangKeluar',
	} );
	return BarangKeluar;
};