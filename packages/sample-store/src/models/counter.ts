import { Sequelize, DataTypes } from 'sequelize';


export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    const Count = sequelize.define('count', {
        name: dataTypes.STRING,
    });
};
