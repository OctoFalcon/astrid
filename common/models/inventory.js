var app = require('../../server/server');
var ds = app.dataSources.db;
var inv = ds.getModel ('inventory');
        
// Hiding the existing remote methods.
inv.sharedClass.find('create',true).shared = false;
inv.sharedClass.find('upsert',true).shared = false;
inv.sharedClass.find('exists',true).shared = false;
inv.sharedClass.find('findById',true).shared = false;
inv.sharedClass.find('find',true).shared = false;
inv.sharedClass.find('findOne',true).shared = false;
inv.sharedClass.find('updateAll',true).shared = false;
inv.sharedClass.find('deleteById',true).shared = false;
inv.sharedClass.find('count',true).shared = false;
inv.sharedClass.find('updateAttributes',false).shared = false;

module.exports = function(inventory){
	//get the inventory of the item:
	inventory. getInventoryById = function(productId,  cb) {
		var inventoryClass = app.models.inventory;
        var inventoryObj = new inventoryClass();
		var inventoryHandler = app.models.InventoryHandler;
		inventoryHandler.getInventory(productId, function(err, inventoryHandlerRes){
			//console.log(inventoryHandlerRes);
			var iaView = inventoryHandlerRes.InventoryAvailability;
			inventoryObj.resourceId = inventoryHandlerRes.resourceId;
			inventoryObj.resourceName = inventoryHandlerRes.resourceName;
			var inventoryAvailabilityClass = app.models.inventoryAvailability;
			var inventoryAvailabilityObj = new inventoryAvailabilityClass({
				availableQty : iaView[0].availableQuantity,
				onlineStoreId : iaView[0].onlineStoreId,
				onlineStoreName : iaView[0].onlineStoreName,
				productId : iaView[0].productId
			});
			inventoryObj.inventoryAvailabilityObj=inventoryAvailabilityObj;
			cb(null, inventoryObj);
		});
    }
    inventory.remoteMethod(
        ' getInventoryById', 
        {
          accepts: [{arg: 'productId', type: 'string'}],
		  http: {path: '/byProductId', verb: 'get'},
          returns: {arg: 'inventory', type: 'JSON'},
        }
    );
};