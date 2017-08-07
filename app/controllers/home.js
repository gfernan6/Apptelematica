var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  mysql = require("mysql");

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'imagenes'
});

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  db.Article.findAll().then(function (articles) {
    res.render('login', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});
router.post('/registrar', function (req, res, next) {
  res.render('registrar', {

  });
});

router.post('/guardarbd', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var data = {
    nombres: input.txtnombre, apellidos: input.txtapellido, usuario: input.txtusuario, password: input.txtpassword
  }
  connection.query('INSERT INTO usuarios SET ?', data,
    function (err, result) {
      if (err) throw err;
    }
  );
  res.render('login', {
    title: 'Generator-Express MVC',
  });
});

router.post('/ingresar', function (req, res, next) {
  var a;
  connection.query('SELECT * from usuarios where usuario="' + req.body.txtusuario + '" and password=' + req.body.txtpassword,
    function (err, rows) {
      if (err) throw err;
      a = rows
      connection.query('SELECT * from imagenes where usuarioid=' + a[0].id.toString(),
        function (err, rows2) {
          if (err) throw err;
          res.render('perfilusuario', {
            lista: rows2,
            data: rows
          })
        });
    });
});

router.post('/publicar', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var data = {
    titulo: input.txttitulo, lugar: input.txtlugar, descripcion: input.txtdescripcion, usuarioid: input.txtid
  }
  var info
  var list
  connection.query('SELECT * from usuarios where usuario="' + req.body.txtusuario + '" and password=' + req.body.txtpassword,
    function (err, rows) {
      if (err) throw err;
      info = rows;
    }
  );

  connection.query('INSERT INTO imagenes SET ?', data,
    function (err, result) {
      if (err) throw err;
    }
  );
  connection.query('SELECT * from imagenes where usuarioid=' + req.body.txtid,
    function (err, rows) {
      if (err) throw err;
      list = rows;
      res.render('perfilusuario', {
        data: info,
        lista: list
      });
    }
  );

});

router.post('/eliminari', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  connection.query('DELETE FROM imagenes where id=' + input.idimagenes,
    function (err, rows) {
      if (err) throw err;
      var a;
      connection.query('SELECT * from usuarios where id=' + input.idusuarios,
        function (err, rows) {
          if (err) throw err;
          a = rows
          connection.query('SELECT * from imagenes where usuarioid=' + a[0].id.toString(),
            function (err, rows2) {
              if (err) throw err;
              res.render('perfilusuario', {
                lista: rows2,
                data: rows
              })
            });
        });
    });
});

router.post('/editarimag', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var datad = {
    titulo: input.txttitulo, lugar: input.txtlugar, descripcion: input.txtdescripcion, id: input.txtid, usuarioid: input.txtusuarioid
  }
  res.render('editarimag', {
    data: datad
  });

});

router.post('/guardaredit', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var data = {
    titulo: input.txttitulo, lugar: input.txtlugar, descripcion: input.txtdescripcion, usuarioid: input.usuarioid
  }
  // res.send(input)
  connection.query('UPDATE imagenes SET ? WHERE id=' + input.id, data,
    function (err, rows) {
      if (err) throw err;
      var a;
      connection.query('SELECT * from usuarios where id=' + input.usuarioid,
        function (err, rows2) {
          if (err) throw err;
          a = rows2
          connection.query('SELECT * from imagenes where usuarioid=' + input.usuarioid,
            function (err, rows3) {
              if (err) throw err;
              res.render('perfilusuario', {
                lista: rows3,
                data: rows2
              })
            });
        });
    });

});


router.post('/editperfil', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  
  connection.query('SELECT * from usuarios where id=' + input.txtid,
    function (err, rows) {
      if (err) throw err;
      
      res.render('editperfil', {
        data: rows
      }
      );
    });

});
    
  router.post('/geditperfil', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var data = {
    nombres:input.txtnombres,apellidos:input.txtapellidos, usuario:input.txtusuario, password: input.txtpassword,
  }
  // res.send(req.body)
connection.query('UPDATE usuarios SET ? WHERE id=' + input.id, data,
    function (err, rows) {
      if (err) throw err; 
      connection.query('SELECT * from usuarios where id=' + input.id,
        function (err, rows3) {
          if (err) throw err;
       connection.query('SELECT * from imagenes where usuarioid=' + input.id,
            function (err, rows2) {
              if (err) throw err;
      
      res.render('perfilusuario', {
            lista: rows2,
            data: rows3
      }
      );
            });
    });
});
  });

router.post('/navegar', function (req, res, next) {
 var input = JSON.parse(JSON.stringify(req.body))

  connection.query('SELECT * FROM usuarios where id=' + input.txtid, function (err, rows) {
    if (err)
      console.log("Error Selecting : %s ", err);
    var a;
    //  res.send(rows)
    a = rows
    connection.query("SELECT * FROM imagenes WHERE (titulo LIKE '%" + input.txtbusqueda + "%' OR lugar LIKE '%" + input.txtbusqueda + "%' OR descripcion LIKE '%" + input.txtbusqueda + "%' ) AND usuarioid=" + a[0].id.toString(),
      function (err, rows2) {
        if (err) throw err;
        res.render('perfilusuario', {
          lista: rows2,
          data: rows
        })
      });
  });
});

router.post('/compartir', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var data = {
    idcompartidor: input.txtid,
  }
  //  res.send(data) 
  connection.query('SELECT * from usuarios ',
    function (err, rows) {
        var list;
    for(var i = 0; i<rows.length;i++){
      rows[i]["data"] = input.txtid;
    }
      list = rows;
// res.send(list)
      res.render('compartir', {
       lista: list,
      });
    }
  );
  
});


router.post('/aggcom', function (req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body))
  var data = {
    idcompartidor:input.idcompartidor, idcompartido:input.idcompartido
  }
  // res.send(req.body)
connection.query('INSERT INTO compartidos SET ?', data,
    function (err, result) {
      if (err) throw err;
    
    connection.query('SELECT * FROM usuarios u INNER JOIN compartidos c ON u.id = c.idcompartidor where u.id='+input.idcompartidor,
    function (err, rows) {
      if (err) throw err;
   res.render('compartidos',{
    data:rows 
   });
    }
    );
  });
});

router.post('/eliminarcom', function (req, res, next) {
var input = JSON.parse(JSON.stringify(req.body))
// res.send(req.body)
  connection.query('DELETE FROM compartidos where id=' + input.id,
    function (err, rows) {
      if (err) throw err;
      
      connection.query('SELECT * FROM usuarios u INNER JOIN compartidos c ON u.id = c.idcompartidor where u.id='+input.idcompartidor,
    function (err, rows) {
      if (err) throw err;
   res.render('compartidos',{
    data:rows 
   });
    }
    );
  });
    }); 

      