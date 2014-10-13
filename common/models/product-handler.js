var request = require('request');
var app = require('../../server/server');

module.exports = function(productHandler){ 
    productHandler.findByIds = function(ids, cb){ 
       uri = 'http://localhost/search/resources/store/11001/productview/byIds?';
       for(var i=0; i < ids.length; i++){
            //console.log('p=',ids[i].trim());
            uri += 'id='+ ids[i].trim() +'&';
        }
        uri = uri.substring(0, uri.length-1);
        // console.log(uri); 
        request.get({
            url: uri,
            method: 'GET',
        }, function(err, response) {
            if (err) console.error(err);
            //console.log('Result',response);
            cb(null, JSON.parse(response.body));
        });
    }

    productHandler.remoteMethod('findByIds', 
        { 
            returns: {arg: 'productHandler', type: 'JSON'},
            http: {path: '/findByIds', verb: 'get'},
            accepts: {arg: 'ids', type: 'array'}
        });
}