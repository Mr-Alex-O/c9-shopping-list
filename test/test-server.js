var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);



describe('Shopping List', function() {
    
    describe('Thinkful Examples', function(){
        it('should list items on get', function(done) {
            chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    should.equal(err, null);
                    res.should.have.status(200);
                    done();
                });
        });
        it('should add an item on post', function(done){
            chai.request(app)
                .post('/items')
                .send({'name': 'Kale'})
                .end(function(err, res){
                    should.equal(err, null);
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('id');
                    res.body.name.should.be.a('string');
                    res.body.id.should.be.a('number');
                    res.body.name.should.equal('Kale');
                    storage.items.should.be.a('array');
                    storage.items.should.have.length(4);
                    storage.items[3].should.be.a('object');
                    storage.items[3].should.have.property('id');
                    storage.items[3].should.have.property('name');
                    storage.items[3].id.should.be.a('number');
                    storage.items[3].name.should.be.a('string');
                    storage.items[3].name.should.equal('Kale');
                    done();
                });
        });
        it('should edit an item on put', function(done){
            chai.request(app)
                .put('/items/1')
                .send({'name': 'Bread'})
                .end(function(err, res){
                    
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('name');
                    res.body.should.have.property('id');
                    res.body.name.should.equal('Bread');
                    res.body.id.should.equal(1);
                    // confirm item 1 was updated in storage
                    
                    done();
                });
        });        
        it('should delete an item on delete', function(done){
            chai.request(app)
            .delete('/items/2')
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(204);
                
                chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    should.equal(err, null);
                    should.equal(res.body[2], null);
                    done();
                });
            });
        });
    
    });
        
    describe('POST routes', function(){
        it('should POST to and ID that exists', function(done){
            chai.request(app)
                .post('/items')
                .send({'name': 'Kale'})
                .end(function(err, res){
                    should.equal(err, null);
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('id');
                    res.body.name.should.be.a('string');
                    res.body.id.should.be.a('number');
                    res.body.name.should.equal('Kale');
                    storage.items.should.be.a('array');
                    storage.items.should.have.length(5);
                    storage.items[3].should.be.a('object');
                    storage.items[3].should.have.property('id');
                    storage.items[3].should.have.property('name');
                    storage.items[3].id.should.be.a('number');
                    storage.items[3].name.should.be.a('string');
                    storage.items[3].name.should.equal('Kale');
                    done();
                });
        });
        it('should POST without body data', function(done){
            chai.request(app)
                .post('/items')
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(400);
                    done();
                });
                
        });
        it('should POST with something other than valid JSON', function(done){
            chai.request(app)
                .post('/items')
                .send('Kale')
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(400);
                    done();
                });
        });
    });   
        
    describe('PUT routes', function(){
        it('should PUT without an ID in the endpoint', function(done){
            chai.request(app)
                .put('/items/')
                .send({name: 'Pizza'})
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(404);
                    done();
                })
                
        });
        it('should PUT with different ID in the endpoint than the body', function(done){
            chai.request(app)
                .put('/items/2')
                .send({name: 'Pizza', id: 123})
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(400);
                    done();
                });
        });
        it('should not PUT to an ID that doesn\'t exist', function(done){
            chai.request(app)
                .put('/items/123')
                .send({name:'Salami'})
                .end(function(err, res){
                    should.not.equal(err, res);
                    res.should.have.status(404);
                    done();
                });
        });
        it('should not PUT without body data', function(done){
            chai.request(app)
                .put('/items/1')
                .end(function(err, res){
                   should.not.equal(err, null);
                   res.should.have.status(400);
                   done();
                });
        });
        it('should not PUT with something other than valid JSON', function(done){
            chai.request(app)
                .put('/items/2')
                .send('kale')
                .end(function(err, res){
                   should.not.equal(err, null);
                   res.should.have.status(400);
                   done();
                });
        });
    });
    
    describe('DELETE routes', function(){
        it('should not DELETE an ID that doesn\'t exist', function(done){
            chai.request(app)
                .delete('/items/123')
                .end(function(err, res){
                   should.not.equal(err, null);
                   res.should.have.status(404);
                   done();
                });
        });
        it('should not DELETE without an ID in the endpoint', function(done){
            chai.request(app)
                .delete('/items/')
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(404);
                    done();
                });
        });
    });
});