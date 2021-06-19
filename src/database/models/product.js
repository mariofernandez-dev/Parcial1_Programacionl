'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // hasMany
      Brand.hasMany(models.Product, {
        foreignKey: 'brands_id',
        as: "products"
      })

      // hasMany
      Category.hasMany(models.Product, {
        foreignKey: 'categories_id',
        as: "products"
      })

      // hasMany
      Size.hasMany(models.Product, {
        foreignKey: 'sizes_id',
        as: "products"
      })

      // hasMany
      Gender.hasMany(models.Product, {
        foreignKey: 'genders_id',
        as: "products"
      })

      // belongsTo
      Image.belongsTo(models.Product);
    
      // belongsToOne
      OrderDetail.belongsTo(models.Product);

  }
};
Product.init({
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  stock: DataTypes.INTEGER,
  stock_min: DataTypes.INTEGER,
  stock_max: DataTypes.INTEGER,
  brands_id: DataTypes.INTEGER,
  categories_id: DataTypes.INTEGER,
  sizes_id: DataTypes.INTEGER,
  genders_id: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Product',
});
return Product;
};