'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // belongsTo
      OrderDetail.belongsTo(models.Order);

      // hasOne
      Payment.hasOne(models.Order, {
        as: 'orders',
        foreignKey: 'payments_id'
      })

       // hasOne
       State.hasOne(models.Order, {
        as: 'orders',
        foreignKey: 'states_id'
      })

       // hasMany
       User.hasMany(models.Order, {
        foreignKey: 'users_id',
        as: "orders"
      })

       // belongsToOne
       Shipping.belongsTo(models.Order);

       
    }
  };
  Order.init({
    number: DataTypes.INTEGER,
    date: DataTypes.DATE,
    total: DataTypes.DECIMAL,
    payments_id: DataTypes.INTEGER,
    users_id: DataTypes.INTEGER,
    user_addresses_id: DataTypes.INTEGER,
    states_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};