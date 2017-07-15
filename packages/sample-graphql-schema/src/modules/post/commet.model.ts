

import * as Sequelize from 'sequelize';


export default (sequelize: Sequelize, DataTypes: Sequelize.DataTypes) => {
    const Comment = sequelize.define('comment', {
        content: DataTypes.String,
    });
    return Comment;
};
