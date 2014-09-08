var app = require('../../server/server');
var ds = app.dataSources.db;
var inventory = ds.getModel ('inventory');
        
// Hiding the existing remote methods.
inventory.sharedClass.find('create',true).shared = false;
inventory.sharedClass.find('upsert',true).shared = false;
inventory.sharedClass.find('exists',true).shared = false;
inventory.sharedClass.find('findById',true).shared = false;
inventory.sharedClass.find('find',true).shared = false;
inventory.sharedClass.find('findOne',true).shared = false;
inventory.sharedClass.find('updateAll',true).shared = false;
inventory.sharedClass.find('deleteById',true).shared = false;
inventory.sharedClass.find('count',true).shared = false;
inventory.sharedClass.find('updateAttributes',false).shared = false;