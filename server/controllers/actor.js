require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var base64 = require('file-base64');

var ActorCtrl = {};
module.exports = ActorCtrl;



//GET /actors - lista todos os atores
ActorCtrl.readAll = function (callback) {
  var params = null;
  var sql = 'SELECT id, name, photo_url AS photoURL FROM Star WHERE is_actor = true';

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

//GET /actor/:id - detalhes de um ator
ActorCtrl.readFromID = function (id, callback) {
  var params = [id];
  var sql = 'SELECT id, name, photo_url AS photoURL FROM Star WHERE is_actor = true AND id = ?';

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

//POST /actors - insere um novo ator
ActorCtrl.insert = function (params, callback) {
  var imageName = params.name.fileNameClean('.' + params.photo.extension);
  base64.decode(params.photo.data, './public/images/' + imageName, function (err, output) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
  });

  var params = [params.name, imageName, true, false];
  var sql = 'INSERT INTO Star (name, photo_url, is_actor, is_director) VALUES (?,?,?,?)';

  database.query(sql, params, 'release', function (err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    ActorCtrl.readFromID(rows.insertId, callback);
  });
};


//PUT /actor/:id - altera um ator
ActorCtrl.edit = function (id, params, callback) {
  var imageName = params.name.fileNameClean('.' + params.photo.extension);
  base64.decode(params.photo.data, './public/user_images/' + imageName, function (err, output) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
  });

  var params = [params.name, imageName, id];
  var sql = 'UPDATE Star SET name = ?, photo_url = ? WHERE id = ? AND is_actor = true';

  database.query(sql, params, 'release', function (err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    ActorCtrl.readFromID(id, callback);
  });
};

//DELETE /actor/:id - remove um ator
ActorCtrl.deleteFromID = function (id, callback) {
  var sql = 'DELETE FROM Star WHERE id = ? AND is_actor = true';
  var params = [id];

  database.query(sql, params, 'release', function (err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    callback(response.result(200));
  });
};