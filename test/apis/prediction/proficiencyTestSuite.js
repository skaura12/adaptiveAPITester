'use strict';
var supertest = require("supertest"),
    expect = require("chai").expect,
    should = require("chai").should(),
    config = require("../../../appConfig"),
    request = supertest(config.adaptiveHost),
    _ = require("lodash"),
    adaptiveModelId = config.adaptiveModelId;

describe('Prediction API',function(){
    describe('Skill Proficiency',function(){
        it("#1 High TimeSpent VS Low TimeSpent",function(done){
            this.timeout(1500000);

            var mockInput = require("./inputMocks/#1.json"),
                key,
                req1Body = _.merge({},config.apiDefaultInputs,mockInput.highTimeSpent),
                req2Body = _.merge({},config.apiDefaultInputs,mockInput.lowTimeSpent);

            for(key in req1Body){
                req1Body[key] = JSON.stringify(req1Body[key]);
            }

            for(key in req2Body){
                req2Body[key] = JSON.stringify(req2Body[key]);
            }

            var req1 = request.post("/adaptive/model/"+adaptiveModelId+"/query/node")
                            .type("form")
                            .send(req1Body)
                            .expect(200);

            var req2 = request.post("/adaptive/model/"+adaptiveModelId+"/query/node")
                            .type("form")
                            .send(req2Body)
                            .expect(200);

            Promise.all([req1,req2]).then(function(respArray){
                var body1 = respArray[0].body,
                    body2 = respArray[1].body;
                //console.log(respArray[0].header);
                expect(body1.nodes).to.be.instanceof(Array);
                expect(body2.nodes).to.be.instanceof(Array);

                body1.nodes.forEach(function(ele,index){
                    expect(ele.id).to.exist;
                    expect(body2.nodes[index].id).to.exist;
                    expect(ele.prof.mean).to.be.above(body2.nodes[index].prof.mean);
                });
                done();
            },function(err){
                done(err);
            });
        });

        it("#2 High Weightage Chunk VS Low Weightage Chunk",function(){

        });

        it("#3 Impact on linked skill on consumption of chunk of a skill",function(){

        });

        it("#4 High Timespent and low score in assessemnt VS only high timespent",function(){

        });
    })

    describe('#Assessment Scores',function(){
        it("#5 High TimeSpent VS Low TimeSpent",function(){

        });

        it("#6 High Weightage Chunk VS Low Weightage Chunk",function(){

        });

        it("#7 Impact on linked skill on consumption of chunk of a skill",function(){

        });
    })

});
