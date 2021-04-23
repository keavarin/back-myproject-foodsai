module.exports = (sequelize, DataTypes)=>{
    const Customer = sequelize.define('Customer',{
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            } 
           
        },
        phoneNumber:{
            type: DataTypes.STRING,
            allowNull: false,
           
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            
           
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        houseNumber:
        {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }
        , 
        road:
        {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }
        , 
        village:
        {
            type: DataTypes.STRING,
            
           
        }
        , 
        district:
        {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        subDistrict:
        {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }
        ,
        province:
        {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }
        ,
        postalCode:
        {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }
        
    },{
        underscored: true 
    });
    
    
    Customer.associate = (models) => {
        Customer.hasMany(models.Order, {
            foreignKey: {
                name: 'customerId',
                allowNull:  false,
                
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        })
    }
    return Customer;
}