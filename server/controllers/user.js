require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var UserCtrl = {};
module.exports = UserCtrl;


UserCtrl.readFromID = function (id, callback) {
    var params = [id];
    var sql = 'SELECT id, name, email, fbToken, photo_url AS photoURL FROM user WHERE id = ?';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400));
            return;
        }

        if (!rows || rows.length == 0) {
            callback(response.error(404));
            return;
        }

        callback(response.result(200, rows[0]));
    });
};

UserCtrl.insert = function (fbToken, userFacebook, callback) {
    params = [userFacebook.name, fbToken, userFacebook.picture.data.url, userFacebook.email];
    sql = 'INSERT INTO user (name, fbToken, photo_url, email) VALUES (?,?,?,?)';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        UserCtrl.readFromID(rows.insertId, callback);
    });
};


UserCtrl.edit = function (id, fbToken, userFacebook, callback) {
    params = [userFacebook.name, fbToken, userFacebook.picture.data.url, userFacebook.email];
    sql = 'UPDATE user SET name = ?, fbToken = ?, photo_url = ? WHERE email = ?';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        UserCtrl.readFromID(id, callback);
    });
};


//POST /auth/signin - autentica o usuário via facebook e atualiza o token no banco
UserCtrl.signin = function (fbToken, callback) {
    var request = require("request");

    var fbURL = 'https://graph.facebook.com/me';
    var actions = '&fields=name,email,id,picture';
    var url = fbURL + '?access_token=' + fbToken + actions;

    var options = {
        url: url,
        method: 'GET',
        encoding: null,
        contentType: 'application/json'
    }

    request(options, function (error, response, body) {
        if (error) {
            callback(response.error(400, error));
            return;
        }

        if (response.statusCode != 200) {
            callback(response.status(response.statusCode).json({ 'message': 'Não foi possível autenticar pelo Facebook.' }));
        } else {
            var userFacebook = JSON.parse(body);

            var params = [userFacebook.email];
            var sql = 'SELECT id, name, email, fbToken, photo_url FROM user WHERE email = ?';

            database.query(sql, params, 'release', function (err, rows) {
                if (err) {
                    callback(response.error(400, err));
                    return;
                }

                if (!rows || rows.length == 0) {
                    UserCtrl.insert(fbToken, userFacebook, callback);
                } else {
                    UserCtrl.edit(rows[0].id, fbToken, userFacebook, callback);
                }
            });
        }
    });
};



