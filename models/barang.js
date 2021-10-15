'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class Barang extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			Barang.belongsTo( models.Pemasok, {
				foreignKey: 'id_pemasok',
				as: 'pemasok'
			} );

			Barang.belongsToMany( models.User, {
				through: 'BarangMasuk',
				as: 'barangmasuk',
				foreignKey: 'id_barang'
			} );

			Barang.belongsToMany( models.Customer, {
				through: 'BarangKeluar',
				as: 'barangkeluar',
				foreignKey: 'id_barang'
			} );

			Barang.hasMany( models.Gambar, {
				foreignKey: 'id_barang',
				as: 'gambar'
			} );
		}
	};
	Barang.init( {
		nama_barang: DataTypes.STRING,
		harga_beli: DataTypes.INTEGER,
		harga_jual: DataTypes.INTEGER,
		stok: DataTypes.INTEGER,
		satuan: DataTypes.STRING,
		id_pemasok: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'Barang',
	} );
	return Barang;
};