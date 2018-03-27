var constants = require('./constant');
exports.sendError = function(res){
	var response = {
		response :{},
		message : constants.responseMessages.ERROR_IN_EXECUTION
	}
	res.status(constants.responseFlags.ERROR_IN_EXECUTION).json(response);
}
exports.invalidCredential = function(res) {
	var response = {
		response : {},
		message : constants.responseMessages.INVALID_CREDENTIAL
	};
	res.status(constants.responseFlags.INVALID_CREDENTIAL).json(response);
}
exports.AlreadyExist = function(result,res) {
	var response = {
		response : result,
		message :constants.responseMessages.EMAIL_ALREADY_EXISTS
	}
	res.status(constants.responseFlags.ALREADY_EXIST).json(response);
}
exports.NoDataFound=function(msg,res){
	var response={
		response :msg,
		message:constants.responseMessages.NO_DATA_FOUND
	}
	res.status(constants.responseFlags.NO_DATA_FOUND).json(response);
}
exports.showresult = function(values, res) {
	var response = {
		response: values,
		message: constants.responseMessages.ACTION_COMPLETE
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
}
exports.deletesuccess = function(res){
	var response = {
		response:{},
		message : constants.responseMessages.USER_DELETED_SUCCESSFULLY
	};
	res.status(constants.responseFlags.USER_DELETED_SUCCESSFULLY).json(response);
}
exports.parameterMissing = function(res) {
	var response = {
		response: {},
		message: constants.responseMessages.PARAMETER_MISSING
	};
	res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
}
exports.reset_pass = function(res){
	var response = {
    	response: {},
        message: "Password changed successfully"
        };
        res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
}
exports.keymissing = function(msg,res){
	var response = {
		response : msg,
	}
	res.send(response);
}


