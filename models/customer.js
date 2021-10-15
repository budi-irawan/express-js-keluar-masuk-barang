'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class Customer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			Customer.belongsToMany( models.Barang, {
				through: 'BarangKeluar',
				as: 'barangkeluar',
				foreignKey: 'id_customer'
			} );
		}
	};
	Customer.init( {
		nama: DataTypes.STRING,
		alamat: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		status: DataTypes.BOOLEAN,
		confirmation_code: DataTypes.STRING,
		reset_token: DataTypes.STRING,
		expire_token: DataTypes.DATE
	}, {
		sequelize,
		modelName: 'Customer',
	} );
	return Customer;
};