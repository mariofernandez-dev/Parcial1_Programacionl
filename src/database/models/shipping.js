'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // hasOne
        Order.hasOne(models.Shipping, {
          as: 'shippings',
          foreignKey: 'orders_id'
        })

        
    }
  };
  Shipping.init({
    street: DataTypes.STRING,
    number: DataTypes.INTEGER,
    orders_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shipping',
  });
  return Shipping;
};