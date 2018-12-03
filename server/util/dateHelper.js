var moment = require('moment');

var DateHelper = {};

DateHelper.sqlDefaultDateFormat = function(pt_br_date){
  return moment( pt_br_date, 'DD/MM/YYYY' ).format('YYYY-MM-DD');
}

DateHelper.todayDate = function(){
  return moment().format('YYYY-MM-DD');
}

DateHelper.sqlSubtractDate = function(date, length, type){
  return moment( date ).subtract(length,type).format('YYYY-MM-DD');
  //ex.: subtract(1,'days')
}

function round(date, duration, method) {
    return moment(Math[method]((+date) / (+duration)) * (+duration));
}

module.exports = DateHelper;
