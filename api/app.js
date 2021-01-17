// Packages necessaris
const express = require('express');
const bodyParser = require('body-parser')
const getConnection = require('./db_config');
const { response, request } = require('express');

// Definim port i inicialitzem express
const port = 3015;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Validar la conexio a la base de dades
console.log("Validating connection...");
try {
  const conn = getConnection()
  conn.end();
}
catch (err){
  conn.end()
  console.error("Failed to connect due to error: " + err);
  return;
}
console.log("Validation succeed!");


/// Rutes ///

app.use('*', (request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
  	response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  	response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, PATCH, DELETE');
    // do logging
    console.log('req.method = ' + request.method);
    console.log('req.URL = ' + request.originalUrl);
    console.log('req.body = ' + JSON.stringify(request.body));
    console.log("======================");
    next();
});

// GET /count/:id (id => recetas, ingredientes, componen)
app.get('/count/:id', (request, response) => {
    
    /// ARREGLAR QUE SE PUEDA ESCAPAR CON UN PLACEHOLDER EL NOMBRE DE LA TABLA!!!!

    const id = request.params.id;
    const conn = getConnection();
    if (id === 'recetas'){
        conn.query("SELECT count(*) as size from recetas", (err, res) => {
            if(err) {
                console.log(err);
                return response.status(500).send({
                    message: "Error al servidor",
                });
            }
            size = res[0]["size"];
            response.status(201).send({
                succes: 'true',
                message: res[0]['size'],
            });
            conn.end();
        });
    } else if(id === 'ingredientes') {
        conn.query("SELECT count(*) as size from ingredientes", (err, res) => {
            if(err) {
                console.log(err);
                return response.status(500).send({
                    message: "Error al servidor",
                });
            }
            size = res[0]["size"];
            response.status(201).send({
                succes: 'true',
                message: res[0]['size'],
            });
            conn.end();
        });
    } else if(id === 'componen'){
        conn.query("SELECT count(*) as size from componen", (err, res) => {
            if(err) {
                console.log(err);
                return response.status(500).send({
                    message: "Error al servidor",
                });
            }
            size = res[0]["size"];
            response.status(201).send({
                succes: 'true',
                message: res[0]['size'],
            });
            conn.end();
        });
    } else {
        response.status(400).send({
            succes: 'true',
            message: 'No existeix cap taula amb aquest nom',
        });
    }
});


// Rutes Recetas

// GET /, /recetas
// Obtenim totes les receptes
app.get('/recetas', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, PATCH, DELETE');
    const conn = getConnection();
    conn.query("SELECT * from recetas", (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: res,
        });
        conn.end();
    });
});

// GET /recetas/id
// Obtenim la recepta amb l'identificador indicat
app.get('/recetas/:id', (request, response) => {
    const id = request.params.id;
    const conn = getConnection();
    conn.query("SELECT * from recetas WHERE id = ?", id, (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        if((Object.keys(res).length === 0)){
            conn.end()
            return response.status(400).send({
              succes: 'true',
              message: "La recepta no existeix"
            })
        }
        response.status(201).send({
            succes: 'true',
            message: res,
        });
        conn.end();
    });
});


// POST /recetas
// Creem una nova recepta

app.post('/recetas', (request, response) => {
    const {nombre, dificultad, tiempo, numPersonas, preparacion, valoracion} = request.body; 
    
    if (!nombre || !dificultad || !tiempo || !numPersonas || !preparacion || !valoracion){
        return response.status(400).send({
          message: "Existeixen camps obligatoris buits"
        });
      }

    const conn = getConnection();
    // Obtenim el max id fins al moment
    conn.query("SELECT max(id) as id FROM recetas", (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        const id = res[0]["id"] + 1;
        // Creem la nova recepta
        conn.query("INSERT INTO recetas VALUES (?, ?, ?, ?, ?, ?, ?)", [nombre, id, dificultad, tiempo, numPersonas, preparacion, valoracion], 
        (err, res) => {
            if(err) {
                console.log(err);
                return response.status(500).send({
                    message: "Error al servidor",
                });
            }
            response.status(201).send({
                succes: 'true',
                message: res,
            });
            conn.end();
        });
        response.status(201).send({
            succes: 'true',
            message: "S'ha afegit una nova recepta, id=" + id,
        });
        conn.end();
    });
});

// PUT /recetas/id
// Modifiquem una recepta de la base de dades
app.put('/recetas/:id', (request, response) => {
    const {nombre, dificultad, tiempo, numPersonas, preparacion, valoracion} = request.body; 
    const id = request.params.id;
    const conn = getConnection();

    if (!nombre || !dificultad || !tiempo || !numPersonas || !preparacion || !valoracion){
        return response.status(400).send({
          message: "Existeixen camps obligatoris buits"
        });
      }

    conn.query("UPDATE recetas SET nombre = ?, dificultad = ?, tiempo = ?, numPersonas = ?, preparacion = ?, valoracion = ? WHERE id = ?",
    [nombre, dificultad, tiempo, numPersonas, preparacion, valoracion, id], (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: "S'ha actualitzat correctament la recepta",
        });
        conn.end();
    });
});


// DELETE /recetas/id
// Borrem una recepta
app.delete('/recetas/:id', (request, response) => {
    const id = request.params.id;
    const conn = getConnection();

    conn.query("DELETE FROM recetas WHERE id = ?", id, (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: "S'ha esborrat correctament la recepta",
        });
        conn.end();
    });
});

// Rutes ingredientes

// GET /ingredientes
// Obtenim tots els ingredients
app.get('/ingredientes', (request, response) => {
    const conn = getConnection();
    conn.query("SELECT * from ingredientes", (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: res,
        });
        conn.end();
    });
});

// GET /ingredients/id
// Obtenim l'ingredient amb l'identificador indicat
app.get('/ingredientes/:id', (request, response) => {
    const id = request.params.id;
    const conn = getConnection();
    conn.query("SELECT * from ingredientes WHERE id = ?", id, (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        if((Object.keys(res).length === 0)){
            conn.end()
            return response.status(400).send({
              succes: 'true',
              message: "L'ingredient no existeix"
            })
        }
        response.status(201).send({
            succes: 'true',
            message: res,
        });
        conn.end();
    });
});


// POST /ingredientes
// Creem un nou ingredient

// PUEDE QUE AÑADE LOS INGREDIENTES A LA TABLA DE RECETAS COMO UN STRING O UN TEXTO EN LUGAR DE UNA RELACION CON LLAVE FORANEA!!

app.post('/ingredientes', (request, response) => {
    const {nombreIn, cantidad, calorias, prot, carb, gras} = request.body; 
    
    if (!nombreIn || !cantidad || !calorias || !prot || !carb || !gras){
        return response.status(400).send({
          message: "Existeixen camps obligatoris buits"
        });
      }

    const conn = getConnection();
    // Obtenim el max id fins al moment
    conn.query("SELECT max(id) as id FROM ingredientes", (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        const id = res[0]["id"] + 1;
        // Creem la nova recepta
        conn.query("INSERT INTO ingredientes VALUES (?, ?, ?, ?, ?, ?, ?)", [nombreIn, id, cantidad, calorias, prot, carb, gras], 
        (err, res) => {
            if(err) {
                console.log(err);
                return response.status(500).send({
                    message: "Error al servidor",
                });
            }
            response.status(201).send({
                succes: 'true',
                message: res,
            });
            conn.end();
        });
        response.status(201).send({
            succes: 'true',
            message: "S'ha afegit un nou ingredient",
        });
        conn.end();
    });
});

// PUT /ingredinetes/id
// Modifiquem una recepta de la base de dades
app.put('/ingredientes/:id', (request, response) => {
    const {nombreIn, cantidad, calorias, prot, carb, gras} = request.body; 
    const id = request.params.id;
    const conn = getConnection();

    if (!nombreIn || !cantidad || !calorias || !prot || !carb || !gras){
        return response.status(400).send({
          message: "Existeixen camps obligatoris buits"
        });
      }

    conn.query("UPDATE ingredientes SET nombreIn = ?, cantidad = ?, calorias = ?, prot = ?, carb = ?, gras = ? WHERE id = ?",
    [nombreIn, cantidad, calorias, prot, carb, gras, id], (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: "S'ha actualitzat correctament l'ingredient",
        });
        conn.end();
    });
});


// DELETE /ingredientes/id
// Borrem un ingredient
app.delete('/ingredientes/:id', (request, response) => {
    const id = request.params.id;
    const conn = getConnection();

    conn.query("DELETE FROM ingredientes WHERE id = ?", id, (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: "S'ha esborrat correctament l'ingredient",
        });
        conn.end();
    });
});


// Rutes de componen

// ENCONTRAR LA MANERA DE HACER UNA QUERY PARA OBTENER TODOS LOS INGREDIENTES DE UNA RECETA PASADA POR ID!!!


//GET /componen
// Obtenim quins ingredients estan a quines receptas
app.get('/componen', (request, response) => {
    const conn = getConnection();
    conn.query("SELECT * from componen", (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: res,
        });
        conn.end();
    });
});

//GET /componen
// Obtenim quins ingredients componen la recepta amb id 
app.get('/componen/:id', (request, response) => {
    const id = request.params.id;
    const conn = getConnection();
    conn.query("SELECT * from componen WHERE idReceta = ?",id, (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: res,
        });
        conn.end();
    });
});


// POST /componen/
// Vinculem un ingredient a una recepta
app.post('/componen/', (request, response) => {
    const {idIngrediente, idReceta} = request.body;
    const conn = getConnection();
    conn.query("INSERT INTO componen VALUES (?, ?)",[idReceta, idIngrediente], (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(201).send({
            succes: 'true',
            message: "Ingredient afegit a la recepta correctament",
        });
        conn.end();
    });
});

// DELETE /componen/
// Borrem tots el ingredients vinculats a una recepta
app.delete('/componen/:id', (request, response) => {
    const idReceta = request.params.id;
    const conn = getConnection();
    conn.query("DELETE FROM componen WHERE idReceta = ?",[idReceta], (err, res) => {
        if(err) {
            console.log(err);
            return response.status(500).send({
                message: "Error al servidor",
            });
        }
        response.status(200).send({
            succes: 'true',
            message: "Ingredients eliminats de la recepta",
        });
        conn.end();
    });
});



// Engegem el server
const server = app.listen(port, (error) => {
    if(error) return console.log(`Error: ${error}`);
    console.log(`Server running on port ${server.address().port}`);
});