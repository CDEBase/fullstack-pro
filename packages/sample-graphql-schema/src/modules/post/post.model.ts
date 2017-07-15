

import * as Sequelize from 'sequelize';


export default (sequelize: Sequelize, DataTypes: Sequelize.DataTypes) => {

    // Fields

    const Post = sequelize.define('post', {
        title: DataTypes.STRING,
        content: DataTypes.String,
    });



    // Associates
    Post.associate = (models) => {
        // 1 to many with comment
        Post.hasMany(models.Comment, {
            foreignKey: 'commentId',
        });
    };

    return Post;
};


