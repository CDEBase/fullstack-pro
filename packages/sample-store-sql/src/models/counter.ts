import * as Sequelize from 'sequelize';


export default (sequelize: Sequelize, DataTypes: Sequelize.DataTypes) => {
    const Count = sequelize.define('count', {
        name: DataTypes.STRING,
    });
};
