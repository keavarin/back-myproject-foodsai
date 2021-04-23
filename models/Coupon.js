module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      status: {
        type: DataTypes.ENUM,
        values: ["TRUE", "FALSE"],
        allowNull: false,
        defaultValue: "TRUE",
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  Coupon.associate = (models) => {
    Coupon.hasMany(models.Order, {
      foreignKey: {
        name: "couponId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Coupon;
};
