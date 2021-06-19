# Parcial1_Programacionl

1)Para comenzar, instalamos las dependencias que necesitamos para el desarrollo del proyecto.

Lo haremos con los siguientes comandos:

-npm init -y
-npm i express
-npm i dotenv
-npm i sequelize mysql2
-npm i sequelize-cli --D

2)Luego crearemos nuestras carpetas de trabajo.

-Crearemos los siguientes archivos en la raiz del proyecto:

.gitignore
.env
.sequelizerc

3) En el .gitignore ponemos:
/node_modules/

4)  el .env (dotenv) ponemos las credenciales del entorno de la base de datos:
DB_USERNAME= root
DB_PASSWORD= (Colocamos la contraseña en caso de que tenga)
DB_HOST= localhost
DB_DATABASE= Parcial_Carrito (Este es el nombre de la base de datos)
DB_PORT=3306
DB_DIALECT=mysql

5)En el "sequelizerc" vamos a colocar de la documentacion oficial (SEQUELIZE ORM google buscar) el siguiente contenido:

const path = require('path')
module.exports = {
config: path.resolve('./src/database/config', 'config.js'),
'models-path': path.resolve('./src/database/models'),
'seeders-path': path.resolve('./src/database/seeders'),
'migrations-path': path.resolve('./src/database/migrations'),
}

6)Luego procedemos a crear la carpeta "src" y "public" en la raiz del proyecto.

7)Dentro de src creamos app.js, creamos la carpeta controller,creamos la carpeta routes.

8)
- En el package.json le decimos que el main sera app.js.
- En el package.json cambio el script que dice "test" por "dev".
- Y dentro le ponemos  "nodemon src/app.js"

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

9)Abrimos el archivo app.js y en su interior ponemos:

const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(express.json())
//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.urlencoded({ extended: false }));

app.use('/', (req, res) => res.json({ clave: "respuesta desde server" }));

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto' + PORT)
}

);

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
10)Abriremos un terminal y luego escribiremos sequelize init para ejecutar el contenido de .sequelizerc eso creará la carpeta database y su contenido dentro de la carpeta src.

11)Dentro de src/database/config/config.js vamos a modificar todo el contenido, pondremos lo siguiente:


require('dotenv').config()

module.exports =

{

    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT,

    seederStorage: "sequelize",
    seederStorageTableName: "seeds",

    migrationStorage: "sequelize",
    migrationStorageTableName: "migrations"

}

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

- La linea de require('dotenv').config() llamara al archivo .env

- Se usara la siguiente linea en la terminal para crear una clase
sequelize model:generate --name Color --attributes name:string

- Siendo comandos de sequelize, model:generate creara el modelo de la clase
-  --name dara nombre a la clase tiene que estar en ingles
-  --attributes dara atributos a las clases con nombre:tipo de dato
-  Entre los atributos se podran crear las Foreign Key(FK) claves foraneas

Con esto en mente necesitare las siguientes clases:

- SIN CLAVE FORANEA (no-FK):

Brand {name:string}
Category {name:string}
Size {centimeter:integer}
Gender {type:string}
Payment {type:string}
State {description:string}
Address {street:string,number:integer}

- CON CLAVE FORANEA (FK) de elementos de arriba:


Product {name:string,price:decimal,stock:integer,stock_min:integer,stock_max:integer,brands_id:integer,categories_id:integer,sizes_id:integer,genders_id:integer}
User {first_name:string,last_name:string,username:string,email:string,password:string,addresses_id:integer}



- CON CLAVE FORANEA (FK) de elementos de arriba

Image {name:string,products_id:integer}
Order {number:integer,date:date,total:decimal,payments_id:integer,users_id:integer,user_addresses_id:integer,states_id:integer}

- CON CLAVE FORANEA (FK) de elementos de arriba

OrderDetail {quantity:decimal,subtotal:decimal,products_id:integer,orders_id:integer}
Shipping {street:string,number:integer,orders_id:integer}

-----------------------------------------------------------------------------------------------------------------------
11)Luego de analizar y observar qué clases tiene claves foraneas y cuales no, procederemos a crearlas con los siguiente comandos, respetando su orden:


sequelize model:generate --name Brand --attributes name:string
sequelize model:generate --name Category --attributes name:string
sequelize model:generate --name Size --attributes centimeter:integer
sequelize model:generate --name Gender --attributes type:string
sequelize model:generate --name Payment --attributes type:string
sequelize model:generate --name State --attributes description:string
sequelize model:generate --name Address --attributes street:string,number:integer

sequelize model:generate --name Product --attributes name:string,price:decimal,stock:integer,stock_min:integer,stock_max:integer,brands_id:integer,categories_id:integer,sizes_id:integer,genders_id:integer
sequelize model:generate --name User --attributes first_name:string,last_name:string,username:string,email:string,password:string,addresses_id:integer

sequelize model:generate --name Image --attributes name:string,products_id:integer
sequelize model:generate --name Order --attributes number:integer,date:date,total:decimal,payments_id:integer,users_id:integer,user_addresses_id:integer,states_id:integer

sequelize model:generate --name OrderDetail --attributes quantity:decimal,subtotal:decimal,products_id:integer,orders_id:integer
sequelize model:generate --name Shipping --attributes street:string,number:integer,orders_id:integer

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

- Con dichos ejemplos podemos analizar las relaciones que nos haran falta.
- Podremos decir que: 

Product BelongsTo Brand, Category, Size, Gender
Product HasMany Image
Product HasOne OrderDetail
  Brand HasMany Product
  Category HasMany Product
  Size HasMany Product
  Gender HasMany Product
  Image BelongsTo Product
Order BelongsToOne Payment, State
Order BelongsTo User
Order HasMany OrderDetail
Order HasOne Shipping
  OrderDetail BelongsToOne Product
  OrderDetail BelongsTo Order
    Payment HasOne Order
    State HasOne Order
    Shipping HasOne Order
Users BelongsToOne Address
  Users HasMany Order
  Address HasOne User

- Como no existen relaciones muchos a muchos no necesitamos BelongsToMany.



- Definire las relaciones de los modelos:

    static associate(models) {

      // belongsTo
      Product.belongsTo(models.Brand);
      // belongsTo
      Product.belongsTo(models.Category);
      // belongsTo
      Product.belongsTo(models.Size);
      // belongsTo
      Product.belongsTo(models.Gender);

      // hasMany
      Product.hasMany(models.Image, {
        foreignKey: 'products_id',
        as: "images"
      })

      // hasOne
      Product.hasOne(models.OrderDetail,{
        foreignKey: 'products_id',
        as: 'orderdetails'
      })
    }
------------------------------------------------------
    static associate(models) {

      // hasMany
      Brand.hasMany(models.Product, {
        foreignKey: 'brands_id',
        as: "products"
      })
    }
-----------------------------------------------------
    static associate(models) {

      // hasMany
      Category.hasMany(models.Product, {
        foreignKey: 'categories_id',
        as: "products"
      })
    }
-----------------------------------------------------
    static associate(models) {

      // hasMany
      Size.hasMany(models.Product, {
        foreignKey: 'sizes_id',
        as: "products"
      })
    }
----------------------------------------------------
    static associate(models) {

      // hasMany
      Gender.hasMany(models.Product, {
        foreignKey: 'genders_id',
        as: "products"
      })
    }
---------------------------------------------------
    static associate(models) {

      // belongsTo
      Image.belongsTo(models.Product);
    }
--------------------------------------------------
    static associate(models) {

      // belongsToOne
      OrderDetail.belongsTo(models.Product);

      // belongsTo
      OrderDetail.belongsTo(models.Order);
    }
----------------------------------------------------
    static associate(models) {

      // belongsToOne
      Order.belongsTo(models.Payment);
      // belongsToOne
      Order.belongsTo(models.State);
      
      // belongsTo
      Order.belongsTo(models.User);

      // hasMany
      Order.hasMany(models.OrderDetail, {
        foreignKey: 'orders_id',
        as: "orderdetails"
      })

      // hasOne
      Order.hasOne(models.Shipping, {
        as: 'shippings',
        foreignKey: 'orders_id'
      })
    }
-----------------------------------------------
    static associate(models) {

      // hasOne
      Payment.hasOne(models.Order, {
        as: 'orders',
        foreignKey: 'payments_id'
      })
    }
-----------------------------------------------
    static associate(models) {

      // hasOne
      State.hasOne(models.Order, {
        as: 'orders',
        foreignKey: 'states_id'
      })
    }
-----------------------------------------------
    static associate(models) {

      // hasMany
      User.hasMany(models.Order, {
        foreignKey: 'users_id',
        as: "orders"
      })

      // belongsToOne
      User.belongsTo(models.Address);
    }
-----------------------------------------------
    static associate(models) {

      // belongsToOne
      Shipping.belongsTo(models.Order);
    }
-----------------------------------------------
    static associate(models) {

      // hasOne
      Address.hasOne(models.User, {
        as: 'users',
        foreignKey: 'addresses_id'
      })
    }
--------------------------------------------------------------

12) En este momento debemos crear las claves foraneas de los modelos, lo haremos de la siguiente manera:


- Migracion de Product
----------------------------------
      brands_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'brands',
          key: 'id'
        }
      },
      categories_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      sizes_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sizes',
          key: 'id'
        }
      },
      genders_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'genders',
          key: 'id'
        }
      },
----------------------------------
- Migracion de User
----------------------------------
      addresses_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id'
        }
      },
----------------------------------
- Migracion de Image
----------------------------------
      products_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
----------------------------------
- Migracion de Order
----------------------------------
      payments_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'payments',
          key: 'id'
        }
      },
      users_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      user_addresses_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'addresses_id'
        }
      },
      states_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'states',
          key: 'id'
        }
      },
----------------------------------
- Migracion de OrderDetail
----------------------------------
      products_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      orders_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
----------------------------------
- Migracion de Shipping
----------------------------------
      orders_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
----------------------------------
13) Luego de haber realizado todo ello, procederemos a corroborar si funciona el servidor, para ello utilizaremos el comando "nodemon src/app.js". 

14) Y como ultimo paso, migraremos las base de datos utilizando el comando "sequelize db:migrate".
sequelize db:migrate
