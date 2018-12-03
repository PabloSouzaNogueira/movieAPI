require('../util/stringExtension.js');

var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');

var UserMovieCtrl = {};
module.exports = UserMovieCtrl;


//GET /user/:id/statistic - informa a quantidade de horas de filme assistidas pelo usuário 
UserMovieCtrl.statistic = function (id, callback) {
    var params = [id];
    var sql = ' SELECT user.id AS userId, SUM(movie.lenght) AS length FROM user \
                INNER JOIN usermovie ON user.id = usermovie.user_id \
                INNER JOIN movie ON usermovie.movie_id = movie.id \
                WHERE user.id = ? AND usermovie.watched = 1';

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

//GET /user/:id/list - retorna uma lista de filmes do usuário (Assistidos, Assistir e Favoritos)
UserMovieCtrl.readAll = function (id, callback) {
    var params = [id];
    var result = { userId: id };

    var sql = ' SELECT movie.id, movie.title, movie.photo_url AS photoURL, movie.released_date AS releasedAt FROM user \
                INNER JOIN usermovie ON user.id = usermovie.user_id \
                INNER JOIN movie ON usermovie.movie_id = movie.id \
                WHERE user.id = ? AND usermovie.watched = 1';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        result.watched = rows;
    });

    sql = ' SELECT movie.id, movie.title, movie.photo_url AS photoURL, movie.released_date AS releasedAt FROM user \
            INNER JOIN usermovie ON user.id = usermovie.user_id \
            INNER JOIN movie ON usermovie.movie_id = movie.id \
            WHERE user.id = ? AND usermovie.toWatch = 1';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        result.toWatch = rows;
    });

    sql = ' SELECT movie.id, movie.title, movie.photo_url AS photoURL, movie.released_date AS releasedAt FROM user \
            INNER JOIN usermovie ON user.id = usermovie.user_id \
            INNER JOIN movie ON usermovie.movie_id = movie.id \
            WHERE user.id = ? AND usermovie.favorite = 1';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        result.favorite = rows;

        callback(response.result(200, result));
    });
};

//POST /user/:id/list - inserir um filme na lista do usuário definindo se foi (Assistido, Assistir e Favorito)
UserMovieCtrl.insert = function (userId, params, callback) {
    var watched = 0;
    var toWatch = 0;
    var favorite = 0;

    for (var i = 0; i < params.list.length; i++) {
        switch (params.list[i]) {
            case 'watched':
                watched = 1;
                break;
            case 'toWatch':
                toWatch = 1;
                break;
            case 'favorite':
                favorite = 1;
                break;
            default:
                break;
        }
    }

    var params = [userId, params.movieId, toWatch, watched, favorite, params.review];
    var sql = ' INSERT INTO usermovie (user_id, movie_id, toWatch, watched, favorite, review) VALUES (?,?,?,?,?,?)';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        UserMovieCtrl.readAll(userId, callback);
    });
};

//DELETE /user/:userid/list/:movieid - deletar um filme na lista do usuário
UserMovieCtrl.deleteFromID = function (userId, movieId, callback) {
    var params = [userId, movieId];
    var sql = ' DELETE FROM usermovie WHERE user_id = ? AND movie_id = ? ';

    database.query(sql, params, 'release', function (err, rows) {
        if (err) {
            callback(response.error(400, err));
            return;
        }

        callback(response.result(200));
    });
};