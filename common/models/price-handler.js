var request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = function(PriceHandler){
	
	//get the price of the item:
	PriceHandler.getPrice = function(productId,  cb) {
	
        var uri = 'http://toothless.ngrok.com/wcs/resources/store/10001/price';
        //console.log('productId : '+productId); 
        request({
            url: uri,
            method: 'POST',	
			json:{ "query": {"name": "byProductID",  "products": [   {    "productId": productId,   }  ] }}	
        }, function(err, response) {
            if (err) console.error(err);
			console.log('Result: '+JSON.stringify(response.body));
			cb(null, response.body);
        });	
		
	 
    }
     
    PriceHandler.remoteMethod(
        'getPrice', 
        {
          accepts: [{arg: 'productId', type: 'string'}],
          returns: {arg: 'PriceResponse', type: 'string'},
        }
    );
};

