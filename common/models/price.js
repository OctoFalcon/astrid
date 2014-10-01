var app = require('../../server/server');
var ds = app.dataSources.db;
var tempPriceObj = ds.getModel ('price');
        
// Hiding the existing remote methods.
tempPriceObj.sharedClass.find('create',true).shared = false;
tempPriceObj.sharedClass.find('upsert',true).shared = false;
tempPriceObj.sharedClass.find('exists',true).shared = false;
tempPriceObj.sharedClass.find('findById',true).shared = false;
tempPriceObj.sharedClass.find('find',true).shared = false;
tempPriceObj.sharedClass.find('findOne',true).shared = false;
tempPriceObj.sharedClass.find('updateAll',true).shared = false;
tempPriceObj.sharedClass.find('deleteById',true).shared = false;
tempPriceObj.sharedClass.find('count',true).shared = false;
tempPriceObj.sharedClass.find('updateAttributes',false).shared = false;
module.exports = function(price){
	//get the price of the item:
	price. getPriceById = function(productId,  cb) {
		var priceClass = app.models.price;
        var priceObj = new priceClass();
		var priceHandler = app.models.PriceHandler;
		priceHandler.getPrice(productId, function(err, priceHandlerRes){
			//console.log(priceHandlerRes);
			if(priceHandlerRes.EntitledPrice){
				var entitledPriceView = priceHandlerRes.EntitledPrice[0];
				priceObj.unitPrice = entitledPriceView.UnitPrice[0].price.value;
				priceObj.productId = entitledPriceView.productId;
				priceObj.partNumber = entitledPriceView.partNumber;
				priceObj.resourceId = priceHandlerRes.resourceId;
				priceObj.resourceName = priceHandlerRes.resourceId;
				priceObj.priceDesc = '';
				priceObj.priceUsage = '';
				priceObj.pricevalue =  '';
			}
				cb(null, priceObj);
		});
    }
    price.remoteMethod(
        'getPriceById', 
        {
          accepts: [{arg: 'productId', type: 'string', description: 'ProductId of the desired Product.'}],
		  http: {path: '/byProductId', verb: 'post'},
          returns: {arg: 'price', type: 'JSON'},
          description: 'Fetch the price of the Product.'
        }
    );
};
