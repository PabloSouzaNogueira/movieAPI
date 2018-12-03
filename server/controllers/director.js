require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var base64 = require('file-base64');

var DirectorCtrl = {};
module.exports = DirectorCtrl;


//GET /directors - lista todos os diretores
DirectorCtrl.readAll = function (callback) {
    var params = null;
    var sql = 'SELECT id, name, photo_url AS photoURL FROM Star WHERE is_director = true';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        if (!rows || rows.length == 0) {
            callback(response.error(404));
            return;
        }

        callback(response.result(200, rows));
    });
};

//GET /directors/:id - detalhes de um diretor
DirectorCtrl.readFromID = function (id, callback) {
    var params = [id];
    var sql = 'SELECT id, name, photo_url AS photoURL FROM Star WHERE is_director = true AND id = ?';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        if (!rows || rows.length == 0) {
            callback(response.error(404));
            return;
        }

        callback(response.result(200, rows[0]));
    });
};

//POST /directors - insere um novo diretor
DirectorCtrl.insert = function (params, callback) {
    var imageName = params.name.fileNameClean('.' + params.photo.extension);
    base64.decode(params.photo.data, './public/user_images/' + imageName, function (err, output) {
        if (err) {
            callback(response.error(400, err));
            return;
        }
    });

    var params = [params.name, imageName, false, true];
    var sql = 'INSERT INTO Star(name, photo_url, is_actor, is_director) VALUES (?,?,?,?)';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        DirectorCtrl.readFromID(rows.insertId, callback);
    });
};


//PUT /director/:id - altera um diretor
DirectorCtrl.edit = function (id, params, callback) {
    var imageName = params.name.fileNameClean('.' + params.photo.extension);
    base64.decode(params.photo.data, './public/user_images/' + imageName, function (err, output) {
        if (err) {
            callback(response.error(400, err));
            return;
        }
    });

    var params = [params.name, imageName, id];
    var sql = 'UPDATE Star SET name = ?, photo_url = ? WHERE id = ? AND is_director = true';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        DirectorCtrl.readFromID(id, callback);
    });
};


//DELETE /director/:id - remove um diretor
DirectorCtrl.deleteFromID = function (id, callback) {
    var params = [id];
    var sql = 'DELETE FROM Star WHERE id = ? AND is_director = true';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        callback(response.result(200));
    });
};