'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			User.belongsTo( models.Role, {
				foreignKey: 'id_role',
				as: 'role'
			} )

			User.belongsToMany( models.Barang, {
				through: 'BarangMasuk',
				as: 'barangmasuk',
				foreignKey: 'id_user'
			} )
		}
	};
	User.init( {
		nama: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		status: DataTypes.BOOLEAN,
		id_role: DataTypes.INTEGER,
		confirmation_code: DataTypes.STRING,
		reset_token: DataTypes.STRING,
		expire_token: DataTypes.DATE
	}, {
		sequelize,
		modelName: 'User',
	} );
	return User;
};