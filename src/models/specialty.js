"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialty.hasMany(models.Doctor_Info, {
        foreignKey: "specialtyId",
        as: "specialtyData",
      });
    }
  }
  Specialty.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
      descMarkdown: DataTypes.TEXT,
      descHTML: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
