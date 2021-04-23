module.exports = (sequelize, DataTypes)=>{
    const Admin = sequelize.define('Admin',{
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            } 
           
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        }
        
    },{
        underscored: true 
    });
    
    
    Admin.associate = (models) => {
        Admin.hasMany(models.Order, {
            foreignKey: {
                name: 'adminId',
                // allowNull:  false,
                
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        })
    }
    return Admin;
}