module.exports = (sequelize, DataTypes)=>{
    const Product = sequelize.define('Product',{
        status:{
            type: DataTypes.ENUM, 
            values: ['ACTIVE', 'NONACTIVE'],
            allowNull: false,
            defaultValue: 'ACTIVE'
           
        },
        price:{
            type: DataTypes.DECIMAL(10,2), 
            allowNull: false
           
        },
        name:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        imgUrl: DataTypes.STRING
        
    },{
        underscored: true 
    });
    
    
    Product.associate = (models) => {
        Product.hasMany(models.OrderItem, {
            foreignKey: {
                name: 'productId',
                allowNull:  false,
                
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        })
    }
    return Product;
}