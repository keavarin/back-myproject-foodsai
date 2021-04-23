module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      status: {
        type: DataTypes.ENUM,
        values: ["TRUE", "FALSE"],
        allowNull: false,
        defaultValue: "FALSE",
      },
      paymentType: {
        type: DataTypes.ENUM,
        values: ["CASH", "CREDIT"],
        allowNull: false,
        defaultValue: "CASH",
      },
    },
    {
      underscored: true,
    }
  );

  Payment.associate = (models) => {
    Payment.hasOne(models.Order, {
      foreignKey: {
        name: "paymentId",
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Payment;
};
