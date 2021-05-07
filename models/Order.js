module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      status: {
        type: DataTypes.ENUM,
        values: [
          "ORDERPLACE",
          "ORDERCONFIRM",
          "ORDERONPROCESS",
          "ORDERCANCEL",
          "ONTHEWAY",
          "ARRIVE",
        ],
        allowNull: false,
        defaultValue: "ORDERPLACE",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      phoneNumberToOrder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      houseNumberToOrder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roadToOrder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      villageToOrder: {
        type: DataTypes.STRING,
      },
      districtToOrder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subDistrictToOrder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provinceToOrder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCodeToOrder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // amount: {
      //     type: DataTypes.INTEGER,
      // },
      discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      TotalPrice: {
        type: DataTypes.DECIMAL(10, 2),
      },
      orderTracking: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.Payment, {
      foreignKey: {
        name: "paymentId",
      },
      onDelete: "RESTRICT",
    }),
      Order.belongsTo(models.Customer, {
        foreignKey: {
          name: "customerId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      }),
      Order.belongsTo(models.Admin, {
        foreignKey: {
          name: "adminId",
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      }),
      Order.belongsTo(models.Coupon, {
        foreignKey: {
          name: "couponId",
        },
        onDelete: "RESTRICT",
      }),
      Order.hasMany(models.OrderItem, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      });
  };
  return Order;
};
