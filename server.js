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

  if(storage.items[id]){
    delete storage.items[id];
    response.status(204);
  } else {
    response.sendStatus(400);
  }
  
});

app.put('/items/:id', function(request, response){
  var id = request.params.id;
  if(Object.keys(storage.items).some(key => key == id)) {
    storage.items[id].name = request.body.name;
    response.status(204);
  } else {
    response.sendStatus(404);
  }
  
});


app.listen(process.env.PORT || 8080, process.env.IP);