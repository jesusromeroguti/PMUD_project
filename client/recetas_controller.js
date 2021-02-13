/*jshint esversion: 6 */ 
let recetaActual;

// Obtiene todas las recetas del server y les da formato en la web cliente.
function getReceptas(){
    
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let r = JSON.parse(xhr.responseText);
            for (x of r["message"]){
                $("#recetas").append(
                    `<div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${x['nombre']}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Dificultad: ${x['dificultad']}</h6> 
                            <h6 class="card-subtitle mb-2 text-muted">Personas: ${x['numPersonas']}</h6>
                            <h6 class="card-subtitle mb-2 text-muted">Tiempo: ${x['tiempo']}</h6>
                            <h6 class="card-subtitle mb-2 text-muted">Valoración: ${x['valoracion']}</h6>
                            <h6 class="card-title mb-2 text-muted">Preparación:</h6>   
                            <div class="card"><p class="card-text">${x['preparacion']}</p></div><br>
                            <h6 class="card-subtitle mb-2 text-muted">Igredients:</h6> 
                            <div style="overflow-x:auto;">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Calorias</th>
                                        <th scope="col">Proteinas</th>
                                        <th scope="col">Grasas</th>
                                        <th scope="col">Carbohidratos</th>
                                    </tr>
                                    <tbody class="ingredients" id="${x['id']}">
                                    </tbody>
                                </thead>
                            </table>
                            </div>
                        <button type="button" class="btn btn-danger" id="btnDelete" onclick="deleteRecepta(${x['id']})">Eliminar</button>
                        <button type="button" class="btn btn-success" id="btnDelete" onclick="editRecepta(${x['id']})">Editar</button>
                    </div>
                </div>
                
                `);
                getComponen(x['id']);
            }
        } else {
            console.log('The request failed!');
        }
    };

    xhr.open('GET', 'http://localhost:3015/recetas');
    xhr.send();
}

// Formulario para añadir nueva receta
function addRecepta(){
    $("body").html(`<h2>Nueva receta</h2>
    <div class="card">
     <form>
        <div class="form-group" id="nombre">
            <label for="nombreR">Nombre receta</label>
            <input type="text" class="form-control" id="nombreC" placeholder="Espaguettis a la carbonara">
        </div>
        <div class="form-group" id="difC">
            <label for="dificultadS">Dificultad</label>
            <select class="form-control" id="dificultadC">
            <option value="facil">facil</option>
            <option value="media">media</option>
            <option value="dificil">dificil</option>
            </select>
        </div>
        <div class="form-group" id="tiempoC">
            <label for="tempsR">Tiempo</label>
            <input type="text" class="form-control" id="tempsR" placeholder="25 min">
        </div>
        <div class="form-group" id="valC">
            <label for="valoracionS">Valoración</label>
            <select class="form-control" id="valoracionC">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            </select>
        </div>
        <div class="form-group" id="numPC">
            <label for="numPersonas">Número de persones</label>
            <select class="form-control" id="numPersonasC">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            </select>
        </div>
        <div class="form-group">
            <label for="preparacionT">Pasos a seguir (preparación)</label>
            <textarea class="form-control" id="preparacionT" placeholder="Descripción de los pasos a seguir para la elaboración de la receta..."></textarea>
        </div>
        <button type="button" class="btn btn-success" id="btnCreate" onclick="createRecepta()">Añadir</button>
        <button type="button" class="btn btn-primary" id="btnBack" onclick="back()">Atrás</button>
    </form>
    </div>
    `);

    $("h2").css("text-align", "center");
    $("#numPC.form-group").css("padding-right", "70%");
    $("#valC.form-group").css("padding-right", "70%");
    $("#difC.form-group").css("padding-right", "70%");
    $("#tiempoC.form-group").css("padding-right", "70%");
    $("#nombre.form-group").css("padding-right", "60%");
    $(".card").css("padding-right", "25%");
    $(".card").css("padding-left", "25%");
    $("textarea").css("height", "250px");
}

// Realiza todos los pasos necesarios para editar una receta. Crea el formulario y envia la petición al servidor.
function editRecepta(id){
    let http = new XMLHttpRequest();

    var url = 'http://localhost:3015/recetas/' + id;
    http.open('GET', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            let r = JSON.parse(http.responseText);
            let nombreDef = r['message'][0]['nombre'];
            let tempsDef = r['message'][0]['tiempo'];
            let preparacionDef = r['message'][0]['preparacion'];
            let dificultadDef = r['message'][0]['dificultad'];
            let valoracionDef = r['message'][0]['valoracion'];
            let numPersonasDef = r['message'][0]['numPersonas'];

            $("body").html(`<h2>Edita la receta</h2>
            <div class="card">
                <form>
                    <div class="form-group" id="nombre">
                        <label for="nombreR">Nombre receta</label>
                        <input type="text" class="form-control" id="nombreC" value="${nombreDef}">
                    </div>
                    <div class="form-group" id="difC">
                        <label for="dificultadS">Dificultad</label>
                        <select class="form-control" id="dificultadC">
                            <option value="facil">facil</option>
                            <option value="media">media</option>
                            <option value="dificil">dificil</option>
                        </select>
                    </div>
                    <div class="form-group" id="tiempoC">
                        <label for="tempsR">Tiempo</label>
                        <input type="text" class="form-control" id="tempsR" placeholder="Tiempo que tardas" value="${tempsDef}">
                    </div>
                    <div class="form-group" id="valC">
                        <label for="valoracionS">Valoración</label>
                        <select class="form-control" id="valoracionC">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div class="form-group" id="numPC">
                        <label for="numPersonas">Numero de persones</label>
                        <select class="form-control" id="numPersonasC">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>6</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="preparacionT">Pasos a seguir (preparación)</label>
                        <textarea class="form-control" id="preparacionT">${preparacionDef}</textarea>
                    </div>
                    <button type="button" class="btn btn-success" id="btnCreate" onclick="updateRecepta(${id})">Actualizar</button>
                    <button type="button" class="btn btn-primary" id="btnBack" onclick="back()">Atrás</button>
                </form>
                </div>
            `);

            $("#dificultadC.form-control").val(dificultadDef);
            $("#valoracionC.form-control").val(valoracionDef);
            $("#numPersonasC.form-control").val(numPersonasDef);

            $("h2").css("text-align", "center");
            $("#numPC.form-group").css("padding-right", "70%");
            $("#valC.form-group").css("padding-right", "70%");
            $("#difC.form-group").css("padding-right", "70%");
            $("#tiempoC.form-group").css("padding-right", "70%");
            $("#nombre.form-group").css("padding-right", "60%");
            $(".card").css("padding-right", "25%");
            $(".card").css("padding-left", "25%");
            $("textarea").css("height", "250px");
        } 
    }
    http.send();
}

// Formulario para añadir un ingrediente.
function addIngredient(){
    $("body").html(`<h2>Nuevo ingrediente</h2>
    <div class="card">
     <form>
        <div class="form-group">
            <label for="nombreR">Nombre ingrediente</label>
            <input type="text" class="form-control" id="nombreI" placeholder="Platano, atun, cebolla, mantequilla...">
        </div>
        <div class="form-group">
            <label for="nombreR">Cantidad</label>
            <input type="text" class="form-control" id="cantidadI" placeholder="100 gr, 100 ml, 2 piezas...">
        </div>
        <div class="form-group">
            <label for="nombreR">Proteina</label>
            <input type="text" class="form-control" id="protI" placeholder="22.5, 10...">
        </div>
        <div class="form-group">
            <label for="nombreR">Grasa</label>
            <input type="text" class="form-control" id="grasI" placeholder="22.5, 10...">
        </div>
        <div class="form-group">
            <label for="nombreR">Hidratos de carbono</label>
            <input type="text" class="form-control" id="carbI" placeholder="22.5, 10...">
        </div>
        <div class="form-group">
            <label for="nombreR">Calorias</label>
            <input type="text" class="form-control" id="calI" placeholder="100, 50...">
        </div>
        <button type="button" class="btn btn-success" id="btnCreate" onclick="createIngredient()">Añadir</button>
        <button type="button" class="btn btn-primary" id="btnBack" onclick="back()">Atrás</button>
     </form>
    </div>
    `);
    $("h2").css("text-align", "center");
    // $(".form-group").css("padding-right", "50%");
    $(".card").css("padding-right", "25%");
    $(".card").css("padding-left", "25%");

}

// Recoge los datos del formulario para crear un nuevo ingrediente mediante la correspondiente petición al servidor.
function createIngredient(){
    let http = new XMLHttpRequest();
    let nombreIn = $("#nombreI").val();
    let cantidad = $("#cantidadI").val();
    let prot = $("#protI").val();
    let gras = $("#grasI").val();
    let carb = $("#carbI").val();
    let calorias = $("#calI").val();

    
    var params = "nombreIn="+nombreIn+"&cantidad="+cantidad+"&calorias="+calorias+"&prot="+prot+"&carb="+carb+"&gras="+gras;
    console.log(params);

    var url = 'http://localhost:3015/ingredientes';
    http.open('POST', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            if(http.statusText === "Bad Request"){
                alert("Hi ha camps obligatoris buits")
            } else {
                console.log("Nuevo ingrediente añadido");
                location.reload();
            }
        } 
    }
    http.send(params);
}

// Obtiene todos los ingredientes medinte una petición y los enseña dandole formato en el cliente web.
function listIngredients(){
    let http = new XMLHttpRequest();
    var url = 'http://localhost:3015/ingredientes/';
    http.open('GET', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            let r = JSON.parse(http.responseText);
            $("body").html(`<h2>Lista de ingredientes</h2>
            <div style="overflow-x:auto;">
                <div class="card">
                    <div class="card-body">
                        <div class="form-group">
                                <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Calorias</th>
                                        <th scope="col">Proteinas</th>
                                        <th scope="col">Grasas</th>
                                        <th scope="col">Hidratos de carbono</th>
                                    </tr>
                                    <tbody class="ingTable">
                                    </tbody>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-success" id="btnBack" onclick="back()">Atrás</button>
            `);
            // $("h2").css("text-align","center");
            for (x of r['message']){
                let id = x['id'];
                let nombre = x['nombreIn'];
                let cantidad = x['cantidad'];
                let calorias = x['calorias'];
                let prot = x['prot'];
                let gras = x['gras'];
                let carb = x['carb'];
                $('.ingTable').append(`
                <tr> 
                <td>${nombre}</td> 
                <td>${cantidad}</td> 
                <td>${calorias}</td> 
                <td>${prot}</td>
                <td>${gras}</td>
                <td>${carb}</td>
                </tr>`); 
            }
        } 
    }
    http.send();
}

// Actualiza la receta con los datos del formulario mediante una petición al servidor.
function updateRecepta(id){
    let http = new XMLHttpRequest();
    let dificultad = $("#dificultadC").val();
    let preparacion = $("#preparacionT").val();
    let valoracion = $("#valoracionC").val();
    let numPersonas = $("#numPersonasC").val();
    let nombre = $("#nombreC").val();
    let tiempo = $("#tempsR").val();
    
    var params = "nombre="+nombre+"&dificultad="+dificultad+"&preparacion="+preparacion+"&valoracion="+valoracion+"&numPersonas="+numPersonas+"&tiempo="+tiempo;

    var url = 'http://localhost:3015/recetas/' + id;
    console.log(url);
    http.open('PUT', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            console.log("Receta actualizada");
            if(confirm("Quieres editar los ingredientes?")){
                editIngredients(id);
            } else {
                location.reload();
            }
        } 
    }
    http.send(params); 
}

function editIngredients(id){
    let http = new XMLHttpRequest();
    url = 'http://localhost:3015/componen/' + id;
    http.open('DELETE', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            console.log("Ingredients eliminats");
            getIngredients(id);
        } 
    }
    http.send();

}

// Borra la receta seleccionada (incluidos los ingredientes) mediante una petición al servidor.
function deleteRecepta(id){
    if(confirm("¿Estas seguro/a que quieres eliminar la receta?")){
        let http = new XMLHttpRequest();
        
        var url = 'http://localhost:3015/recetas/' + id;
        http.open('DELETE', url, true);
        
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        http.onreadystatechange = function() {
            if (http.readyState == XMLHttpRequest.DONE) {
                console.log("Recepta eliminada");
            } 
        }
        http.send();

        let http2 = new XMLHttpRequest();
        url = 'http://localhost:3015/componen/' + id;
        http2.open('DELETE', url, true);
        
        http2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        http2.onreadystatechange = function() {
            if (http.readyState == XMLHttpRequest.DONE) {
                console.log("Ingredients eliminats");
            } 
        }
        http2.send();
        location.reload();
    }
    
}

// Crea una nueva receta mediante los datos del formulario y una petición al servidor.
function createRecepta(){
    let http = new XMLHttpRequest();
    let dificultad = $("#dificultadC").val();
    let preparacion = $("#preparacionT").val();
    let valoracion = $("#valoracionC").val();
    let numPersonas = $("#numPersonasC").val();
    let nombre = $("#nombreC").val();
    let tiempo = $("#tempsR").val();
    
    var params = "nombre="+nombre+"&dificultad="+dificultad+"&preparacion="+preparacion+"&valoracion="+valoracion+"&numPersonas="+numPersonas+"&tiempo="+tiempo;
    
    var url = 'http://localhost:3015/recetas/';
    http.open('POST', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        console.log(http.statusText);
        if (http.readyState == XMLHttpRequest.DONE) {
            if(http.statusText === "Bad Request"){
                alert("Hi ha camps obligatoris buits")
            } else {
                console.log("Nova recepta afegida")
                let r = JSON.parse(http.responseText);
                recetaActual = r['message'].split("=")[1];
                // console.log(recetaActual);
                getIngredients(recetaActual);
            }
        } 
    }
    http.send(params);
}

// Obtiene la información de una ingrediente específico de una determinada receta.
function getIngredient(idReceta, idIngrediente){
    let http = new XMLHttpRequest();
    var url = 'http://localhost:3015/ingredientes/' + idIngrediente;
    http.open('GET', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            let r = JSON.parse(http.responseText);
            console.log(r);
            let nombre = r['message'][0]['nombreIn'];
            let cal = r['message'][0]['calorias'];
            let carb = r['message'][0]['carb'];
            let gras = r['message'][0]['gras'];
            let prot = r['message'][0]['prot'];
            $(`#${idReceta}.ingredients`).append(`
            <tr> 
                <td>${nombre}</td> 
                <td>${cal}</td> 
                <td>${prot}</td>
                <td>${gras}</td>
                <td>${carb}</td>
                </tr>
            `);
        } 
    }
    http.send();
}

// Obtiene todos los ingredientes de la receta indicada.
function getIngredients(id){
    let http = new XMLHttpRequest();
    var url = 'http://localhost:3015/ingredientes/';
    http.open('GET', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            let r = JSON.parse(http.responseText);
            $("body").html(`<h2>Añadir los ingredientes</h2>
            <div class="card">
            <form>
                <div class="form-group">
                    <label for="ingredientL">Selecciona los ingredientes</label>
                    <div class="sel">
                    <select multiple class="form-control" id="ingredientsC" style="max-height:90%;">
                    </select></div>
                </div>
            </form>
            <div class="btnAdd"><button type="button" class="btn btn-success" id="btnAdd" onclick="addIngredients(${id})">Añadir</button></div>
            </div>
            `);
            $("h2").css("text-align", "center");
            $(".card").css("padding-right", "25%");
            $(".card").css("padding-left", "25%");
            $(".btnAdd").css("padding-rigth", "75%");
            for (x of r['message']){
                let id = x['id'];
                let nombre = x['nombreIn'];
                $('#ingredientsC').append(`<option value="${id}"> ${nombre} </option>`); 
            }
        } 
    }
    http.send();
}

// Obtiene todas las relaciones entre una receta y todos sus ingredientes.
function getComponen(id){
    let http = new XMLHttpRequest();
    var url = 'http://localhost:3015/componen/' + id;
    http.open('GET', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {
            let r = JSON.parse(http.responseText);
            if(r['message'].length !== 0){
                console.log("Te ingredients");
                for(i of r['message']){
                    let idIngrediente = i['idIngrediente'];
                    getIngredient(id, idIngrediente);
                }
            } else {
                console.log("No hi ha ingredients");
            }
        } 
    }
    http.send();
}

// Añade ingredientes a una receta indicada.
function addIngredients(id){
   let idIngrediente = $('#ingredientsC').val();
   let idReceta = id;
   for(i of idIngrediente){
       console.log(i);
       console.log(idReceta);
        let http = new XMLHttpRequest();
        var url = 'http://localhost:3015/componen';
        http.open('POST', url, true);
        var params = "idIngrediente="+i+"&idReceta="+idReceta;

        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {
            if (http.readyState == XMLHttpRequest.DONE) {
                console.log("Nou ingredient afegit");
            } 
        }
        http.send(params);
    }
    back();
}


// Utilizada en el boton atrás.
function back(){
    location.reload();
}




