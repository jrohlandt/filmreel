'use strict';

module.exports = function(sequelize, DataTypes) {
  var webinar = sequelize.define('webinar', {
    title: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return webinar;
};
