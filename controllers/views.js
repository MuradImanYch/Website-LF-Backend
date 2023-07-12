const db = require('../db.js');

module.exports.post = (req, res) => {
    db.query(`SELECT views FROM news WHERE id = "${req.body.id.split('-')[0]}"`, ((err, results) => {
        if(err) throw err;
        const ipAddress = req.body.clientIP;
        results[0].views?.includes(`${req.body.clientIP}`) ? null :
    db.query(
        `SELECT views FROM news WHERE id="${req.body.id.split('-')[0]}"`,
        (error, results) => {      
          // Извлечение предыдущего значения поля "views"
          const previousViews = results[0].views;
      
          // Обновление значения поля "views" с добавлением предыдущего и нового IP-адресов
          const updatedViews = previousViews ? `${previousViews},${ipAddress}` : ipAddress;
          db.query(
            `UPDATE news SET views = ? WHERE id="${req.body.id.split('-')[0]}"`,
            [updatedViews],
            (err, results) => {
              if(err) console.log(err);
            }
          );
        }
      );
    }));
}

module.exports.checkIP = (req, res) => {
    db.query(`SELECT views FROM news WHERE id = ${req.body.id}`, ((err, results) => {
        if(err) throw err;
        res.send(results[0].views?.split(',') !== undefined && JSON.stringify(Array.from(results[0].views.split(',')).length));
      }));
}