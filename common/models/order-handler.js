var request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = function(OrderHandler){
	
	//Add item to cart:
	OrderHandler.addItemToCart = function(addItemToCart,  cb) {
	
        var uri = 'http://restfalcon.mybluemix.net/addItemToCart/8';
        console.log(uri); 
        request({
            url: uri,
            method: 'GET',						
        }, function(err, response) {
            if (err) console.error(err);
           // console.log('Result'+JSON.stringify(response.body));
			cb(null, JSON.parse(response.body));
        });	
		
	 
    }
     
    OrderHandler.remoteMethod(
        'addItemToCart', 
        {
          accepts: [{arg: 'reqBody', type: 'string'}],
          returns: {arg: 'addItemToCart', type: 'string'},
        }
    );
	//Add item 2 cart:
	OrderHandler.addItem2Cart = function(prodId, qty, wcToken, trustedToken, pId, uId, cb) {
        var uri = 'https://localhost/wcs/resources/store/10151/cart';
        //console.log("prodId: "+prodId+" QTY: "+qty); 
        request({
            url: uri,
            method: 'POST',
			headers:{"WCToken": wcToken,
					"WCTrustedToken": trustedToken,
					"personalizationID": pId,
					"userId": uId
				},				
			json:{
				"orderItem": [{
				"productId": prodId,
				"quantity": ''+qty
				}]
			},
        }, 
		function(err, response) {
            if (err) console.error(err);
			//console.log('Result: '+JSON.stringify(response.body));
			cb(null, response);
        });	
    }
    OrderHandler.remoteMethod(
        'addItem2Cart', 
        {
          accepts: [{arg: 'prodId', type: 'string'},{arg: 'qty', type: 'number'},{arg: 'wcToken', type: 'string'},
					{arg: 'trustedToken', type: 'string'},{arg: 'pId', type: 'string'},{arg: 'uid', type: 'string'}],
          returns: {arg: 'add2Cart', type: 'string'},
        }
    );

	//Display cart:
	/*
	OrderHandler.displayCart = function(displayCart,  cb) {
	
        var uri = 'http://restfalcon.mybluemix.net/displayCart/9';
        console.log(uri); 
        request({
            url: uri,
            method: 'GET',						
        }, function(err, response) {
            if (err) console.error(err);
           // console.log('Result'+JSON.stringify(response.body));
			cb(null, JSON.parse(response.body));
        });	
		
	 
    }*/
    
		OrderHandler.displayCart = function( wcToken, trustedToken, pId, uId, cb) {
        var uri = 'https://localhost/wcs/resources/store/10151/cart/@self';

        request({
            url: uri,
            method: 'GET',
			headers:{"WCToken": wcToken,
					"WCTrustedToken": trustedToken,
					"personalizationID": pId,
					"userId": uId
			}
        }, 
		function(err, response) {
            if (err) console.error(err);
			console.log('Result: '+JSON.stringify(response.body));
			cb(null, '{'+response.request.headers+","+response.body+'}');
        });	
    }
	
    OrderHandler.remoteMethod(
        'displayCart', 
        {
          accepts: [{arg: 'wcToken', type: 'string'},{arg: 'trustedToken', type: 'string'},{arg: 'pId', type: 'string'},{arg: 'uid', type: 'string'}],
          returns: {arg: 'cartresponse', type: 'string'},
        }
    );
	
	//Update user checkout profile
	OrderHandler.updateUserCheckoutProfile = function(updateUserCheckoutProfile,  cb) {
	
        var uri = 'http://restfalcon.mybluemix.net/updateUserCheckoutProfile/10';
        console.log(uri); 
        request({
            url: uri,
            method: 'GET',						
        }, function(err, response) {
            if (err) console.error(err);
           // console.log('Result'+JSON.stringify(response.body));
			cb(null, JSON.parse(response.body));
        });	
		
	 
    }
     
    OrderHandler.remoteMethod(
        'updateUserCheckoutProfile', 
        {
          accepts: [{arg: 'reqBody', type: 'string'}],
          returns: {arg: 'updateUserCheckoutProfile', type: 'string'},
        }
    );
	

	
	//Pre checkout the order :
	OrderHandler.preCheckout = function(preCheckout,  cb) {
	
        var uri = 'http://restfalcon.mybluemix.net/preCheckout/11';
        console.log(uri); 
        request({
            url: uri,
            method: 'GET',						
        }, function(err, response) {
            if (err) console.error(err);
           // console.log('Result'+JSON.stringify(response.body));
			cb(null, JSON.parse(response.body));
        });	
		
	 
    }
     
    OrderHandler.remoteMethod(
        'preCheckout', 
        {
          accepts: [{arg: 'reqBody', type: 'string'}],
          returns: {arg: 'preCheckout', type: 'string'},
        }
    );
	
	//Checkout shopping cart :
	OrderHandler.checkout = function(checkout,  cb) {
	
        var uri = 'http://restfalcon.mybluemix.net/checkout/12';
        console.log(uri); 
        request({
            url: uri,
            method: 'GET',						
        }, function(err, response) {
            if (err) console.error(err);
           // console.log('Result'+JSON.stringify(response.body));
			cb(null, JSON.parse(response.body));
        });	
		
	 
    }
     
    OrderHandler.remoteMethod(
        'checkout', 
        {
          accepts: [{arg: 'reqBody', type: 'string'}],
          returns: {arg: 'checkout', type: 'string'},
        }
    );	
};

