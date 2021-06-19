'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasOne(models.OrderDetail,{
        foreignKey: 'products_id',
        as: 'orderdetails'
      })

      // hasMany
      Order.hasMany(models.OrderDetail, {
        foreignKey: 'orders_id',
        as: "orderdetails"
      })

      
    }
  };
  OrderDetail.init({
    quantity: DataTypes.DECIMAL,
    subtotal: DataTypes.DECIMAL,
    products_id: DataTypes.INTEGER,
    orders_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};