/**
 * Created by ARYA on 8/25/2017.
 */
var mongoose = require('mongoose');

var ProfessorStructure = {
    ProfessorName: String,
    ProfessorEmail: String,
    Courses: []
};

var Schema = new mongoose.Schema(ProfessorStructure);
var ProfessorModel = mongoose.model('Professors', Schema);

module.exports.getProfessorModel = function () {
    return ProfessorModel;
};
