var responseHelper = {};

responseHelper.error = function(statusCode, errorMessage){
  var message = "";
  switch (statusCode) {
    case 400:
      message = errorMessage;
      break;
    case 404:
      message = "Not Found!";
      break;
    case 409://Conflict
      message = errorMessage;
      break;
    case 500:
      message = "Internal Server Error!";
  }

  var dataError = {
    "statusCode": statusCode,
    "error": {
      "message": message
    }
  };
  console.log(dataError);
  return dataError;
};

responseHelper.result = function(statusCode,data){
  var dataSuccess = {
    "statusCode": statusCode,
    "result": data
  };

  return dataSuccess;
};

module.exports = responseHelper;
