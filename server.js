var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  } 
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 0;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

function findById(array, id){
  for(var i = 0; i < array.length; i++){
    if(array[i].id === id){
      array[i].splice(i,1);
    }
  }
}

var app = express();
app.use(express.static('public'));

app.use(bodyParser.json());

app.route('/items')
  //get route for /items
  .get(function(request, response) {
    response.json(storage.items);
  })
  //post route for /items
  .post(jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', function(request, response){
  var id = request.params.id;

  if(!storage.items[id]){
    return response.sendStatus(404);
  }
  
    delete storage.items[id];
    response.sendStatus(204);
  
});

app.put('/items/:id', function(request, response){
  var id = request.params.id;
  
  if(request.body && request.body.id && id != request.body.id){
    return response.sendStatus(400);
  }
  
  if(!('name' in request.body)){
    return response.sendStatus(400);
  }
  
  if(!storage.items[id]) {
    return response.sendStatus(404);
  }
  
  storage.items[id].name = request.body.name;
  response.status(200).json(storage.items[id]);
  
});


app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;