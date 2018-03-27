var mysql = require('mysql');
var md5 = require('md5');
var connection = require('../modules/connection');
var response = require('../modules/response');
var commonfunction = require('../modules/commonfunction');
exports.login = function(req, res) {

    var manValue = ["email", "password"];
    var {email,password} = req.body;
    var access_token = md5(new Date());
    keyValue = (Object.keys(req.body));
    var keyData = JSON.stringify(keyValue);
    var manValueData = JSON.stringify(manValue);
    if (manValueData.indexOf(keyData) >= 0) {
        var manValueParameter = [email, password];
        var checkBlank = commonfunction.checkBlank(manValueParameter);
        if (checkBlank == 1) {
            response.parameterMissing(res);
        } else {
            var access_token_update = "update `td_user` set `access_token`=? WHERE `email`=?";
            var values = [access_token, email];
            connection.query(access_token_update, values, function(err, result) {
                if (err) {
                    response.sendError(res);
                } else {
                    var sql = "SELECT * FROM `td_user` WHERE `email`=? AND `password`=?";


                    var values = [email, md5(password)];

                    connection.query(sql, values, function(err, result) {
                        console.log(result);
                        if (err) {
                            response.sendError(res);
                            return;
                        } else {

                            if (result.length > 0) {
                                result[0].password = "";
                                response.showresult(result[0], res);
                                return;
                            } else {
                                response.invalidCredential(res);
                                return;
                            }

                        }
                    });

                }

            });
        }
    } else {
        for (var i = 0; i < keyValue.length; i++) {
            if (keyValue[i] != manValue[i]) {
                var msg = ("key missing of " + keyValue[i]);
                response.keymissing(msg, res);
            }

        }
    }
}
exports.signup = function(req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    var password = md5(password);
    var access_token = md5(new Date());

    var sql = "SELECT * FROM `td_user` WHERE `email`=?";
    var values = [email, password];

    connection.query(sql, values, function(err, result) {

        if (err) {
            response.sendError(res);
        } else if (result.length > 0) {
            response.AlreadyExist(result,res);
        } else {
                var user_id = md5(commonfunction.generaterandomstring());
                var sql = "INSERT INTO `td_user`(`user_id`,`access_token`,`first_name`,`last_name`,`email`, `password`) VALUES (?,?,?,?,?,?)";
                var values = [user_id,access_token,first_name,last_name, email, password];
                connection.query(sql, values, function(err, result) {
                    if (err) {
                        console.log(err);
                        response.sendError(res);
                    } else {
                        var sql = "SELECT * FROM `td_user` WHERE `user_id`=?";
                        var values = [user_id];
                        connection.query(sql, values, function(err, result) {
                            console.log(err);
                            if (err) {
                                response.sendError(res);
                            } else {
                                response.showresult(result, res);
                                console.log(result[0]);
                            }
                        });
                    }
                });

         }
    });
}
exports.update = function(req, res) {
    var user_id = req.body.user_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    //var gender = req.body.gender;
    var age = req.body.age;
   // var description = req.body.description;
    var sql = "SELECT * FROM `td_user` WHERE `user_id`=?";
    connection.query(sql, [user_id], function(err, result) {
        if (err) {
            response.sendError(res);
            return;
        } else if (result.length > 0) {
            console.log(age);
            if (age > 18) {

                var update_sql = "";
                var values = [];
                if (req.files.length == 0) {
                    update_sql = "UPDATE `td_user` SET `first_name`=?,`last_name`=?,`age`=? WHERE `user_id`=?";
                    values = [first_name, last_name, age, user_id];
                    connection.query(update_sql, values, function(err, result) {
                        if (err) {
                            console.log(err);
                            response.sendError(res);
                            return;
                        } else {
                            var sql = "SELECT * FROM `td_user` WHERE `user_id`=?";
                            var value = [user_id];
                            connection.query(sql, value, function(err, result) {
                                if (err) {
                                    response.sendError(res);
                                    return;
                                } else {
                                    response.showresult(result, res);
                                    return;
                                }
                            });
                        }
                    });
                } else {
                    console.log(req.files.length);
                    for (var i = 0; i < req.files.length; i++) {
                        if (req.files[i].fieldname == "profile_image") {
                            console.log(req.files[i]);
                            update_sql = "UPDATE `td_user` SET `profile_image`=?,`first_name`=?,`last_name`=?,`gender`=?,`age`=?, `description`=? WHERE `user_id`=?";
                            values = [req.files[i].filename, first_name, last_name, gender, age, description, user_id];
                            connection.query(update_sql, values, function(err, result) {
                                if (err) {
                                    console.log(err);
                                    response.sendError(res);
                                    return;
                                } else {
                                    var sql = "SELECT * FROM `td_user` WHERE `user_id`=?";
                                    var value = [user_id];
                                    connection.query(sql, value, function(err, result) {
                                        if (err) {
                                            response.sendError(res);
                                            return;
                                        } else {
                                            response.success(result, res);
                                            return;
                                        }
                                    });
                                }
                            });
                        } else if (req.files[i].fieldname == "cover_image") {
                            console.log(req.files[i]);
                            update_sql = "UPDATE `td_user` SET `cover_image`=?, `first_name`=?,`last_name`=?, `gender`=?, `age`=?, `description`=? WHERE `user_id`=?";
                            values = [req.files[i].filename, first_name, last_name, gender, age, description, user_id];
                            connection.query(update_sql, values, function(err, userDetails) {
                                if (err) {
                                    console.log(err);
                                    response.sendError(res);
                                    return;
                                } else {
                                    var sql = "SELECT * FROM `td_user` WHERE `user_id`=?";
                                    var value = [user_id];
                                    connection.query(sql, value, function(err, result) {
                                        if (err) {
                                            response.sendError(res);
                                            return;
                                        } else {
                                            response.success(result, res);
                                            return;
                                        }
                                    });
                                }
                            });
                        }
                    }
                }

            } else {
                msg = "only 18+ should be registered here...";
                response.NoDataFound(msg, res);
            }

        } else {
            var msg = "No Data Found";
            response.NoDataFound(msg, res);
            return;
        }

    });
}
exports.delete = function(req, res) {
    var user_id = req.body.user_id;
    var sql = "delete from `td_user` WHERE `user_id`= ?";
    var values = [user_id];
    connection.query(sql, values, function(err, result) {
        console.log("SDF");
        if (err) {
            response.sendError(res);
            return;
        } else {
            response.deletesuccess(res);
            return;
        }
    });
}
exports.reset_password = function(req, res) {

    var email = req.body.email;
    var password = req.body.new_password;

    var get_user = "SELECT * FROM `td_user` WHERE `email`=?";
    connection.query(get_user, [email], function(err, user) {

        if (user.length > 0) {
            var pass = md5(password);
            console.log(hash);
            var update_password = "UPDATE `td_user` SET `password`='"+pass+"' WHERE `email`=?";
            connection.query(update_password, [email], function(err, result){
                if (err) {
                    responses.sendError(res);
                } else {
                    response.reset_pass(res);
                }
            });

        } else {
           response.sendError(res);
        }
    });
}
exports.take_me_in = function(req, res){
    var job_title = req.body.job_title;
    var company = req.body.company;
    var country = req.body.country;
    var city = req.body.city;
    var sector = req.body.sector;
    var contract_type = req.body.contract_type;
    var starting_date = req.body.starting_date;
    var ending_date = req.body.ending_date;
    var user_id = req.body.user_id;
    var access_token = req.body.access_token;
    var job_id = md5(new Date());
    console.log(access_token);
    var user_id_sql = "select `user_id` from `td_user` where `access_token` = ?";
    connection.query(user_id_sql,[access_token],function(err,result){
        if(err){
            console.log('error');
            response.sendError(res);

        } else {
            var user_id = result[0].user_id;
            console.log(user_id);
            var insert_sql = "INSERT INTO `td_experience_details` (`user_id`,`job_id`,`job_title`,`company`,`country`,`city`,`sector`,`contract_type`,`starting_date`,`ending_date`) VALUES (?,?,?,?,?,?,?,?,?,?)";
            var values = [user_id,job_id,job_title,company,country,city,sector,contract_type,starting_date,ending_date];
            connection.query(insert_sql,values,function(err,result){
                if(err){
                    response.sendError(res);
                } else{
                    response.showresult(result,res);
                }
            })
        }

    })
}
