const db = require('../db.js');

module.exports.post = (req, res) => {
    const ipAddress = req.body.clientIP;
    db.query(
        `SELECT likes FROM news WHERE id="${req.body.id.split('-')[0]}"`,
        (error, results) => {      
          // Извлечение предыдущего значения поля "likes"
          const previousLikes = results[0].likes;
      
          // Обновление значения поля "likes" с добавлением предыдущего и нового IP-адресов
          const updatedLikes = previousLikes ? `${previousLikes},${ipAddress}` : ipAddress;
          db.query(
            `UPDATE news SET likes = ? WHERE id="${req.body.id.split('-')[0]}"`,
            [updatedLikes],
            (err, results) => {
              if(err) console.log(err);
            }
          );
        }
      );
}

module.exports.checkIP = (req, res) => {
  db.query(`SELECT likes FROM news WHERE id = ${req.body.id}`, ((err, results) => {
    if(err) throw err;
    res.send(results[0].likes?.split(',') !== undefined && JSON.stringify(Array.from(results[0].likes.split(',')).indexOf(req.body.clientIP)));
  }));
}