var app = require('../../server/server');
var ds = app.dataSources.db;
var order = ds.getModel ('order');
        
// Hiding the existing remote methods.
order.sharedClass.find('create',true).shared = false;
order.sharedClass.find('upsert',true).shared = false;
order.sharedClass.find('exists',true).shared = false;
order.sharedClass.find('findById',true).shared = false;
order.sharedClass.find('find',true).shared = false;
order.sharedClass.find('findOne',true).shared = false;
order.sharedClass.find('updateAll',true).shared = false;
order.sharedClass.find('deleteById',true).shared = false;
order.sharedClass.find('count',true).shared = false;
order.sharedClass.find('updateAttributes',false).shared = false;