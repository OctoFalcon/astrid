var app = require('../../server/server');
var ds = app.dataSources.db;
var ord = ds.getModel ('order');
        
// Hiding the existing remote methods.
ord.sharedClass.find('create',true).shared = false;
ord.sharedClass.find('upsert',true).shared = false;
ord.sharedClass.find('exists',true).shared = false;
ord.sharedClass.find('findById',true).shared = false;
ord.sharedClass.find('find',true).shared = false;
ord.sharedClass.find('findOne',true).shared = false;
ord.sharedClass.find('updateAll',true).shared = false;
ord.sharedClass.find('deleteById',true).shared = false;
ord.sharedClass.find('count',true).shared = false;
ord.sharedClass.find('updateAttributes',false).shared = false;

module.exports = function(order){
	//add item to cart:
	order.addItemToCart = function(productId, qty, cb) {
		var wcToken ; 
		var wcTrustedToken;
		var uId;
		var pId;

		var liHandlers = app.models.LoginIdentityHandler;
			liHandlers.guestIdentity( function(err, liHandlersRes){
				console.log('Guest Id response::'+liHandlersRes);
				if(liHandlersRes){
					var wcToken = liHandlersRes.WCToken; 
					var wcTrustedToken  = liHandlersRes.WCTrustedToken;
					var pId = liHandlersRes.personalizationID;
					var uId = liHandlersRes.userId;
					var ordHandlers = app.models.OrderHandler;
					
					ordHandlers.addItem2Cart(productId, qty, wcToken, wcTrustedToken, pId, uId, function(err, ordHandlersRes){
						//console.log(ordHandlersRes);

						cb(null, ordHandlersRes);
					});
				}		
			});
	}
    order.remoteMethod(
        'addItemToCart', 
        {
          accepts: [{arg: 'productId', type: 'string'},{arg: 'qty', type: 'number'}],
		  http: {path: '/addItemToCart', verb: 'post'},
          returns: {arg: 'addToCart', type: 'JSON'},
        }
    );
	
	
	
	//Get cart details:
	order.getCartDetails = function( wcToken, trustedToken, pId, uId, cb) {

		var ordHandlers = app.models.OrderHandler;
		
		ordHandlers.displayCart(wcToken, trustedToken, pId, uId, function(err, cartResp){
			console.log(cartResp);
			if(cartResp){
				console.log('Cart response:::: '+cartResp);
			}
				cb(null, cartResp);
		});

	}
    order.remoteMethod(
        'getCartDetails', 
        {
          accepts: [{arg: 'wcToken', type: 'string'},{arg: 'trustedToken', type: 'string'},{arg: 'pId', type: 'string'},{arg: 'uid', type: 'string'}],
		  http: {path: '/getCartDetails', verb: 'post'},
          returns: {arg: 'CartResp', type: 'JSON'},
        }
    );	
};