var app = require('../../server/server');
var ds = app.dataSources.db;
var price = ds.getModel ('price');
        
// Hiding the existing remote methods.
price.sharedClass.find('create',true).shared = false;
price.sharedClass.find('upsert',true).shared = false;
price.sharedClass.find('exists',true).shared = false;
price.sharedClass.find('findById',true).shared = false;
price.sharedClass.find('find',true).shared = false;
price.sharedClass.find('findOne',true).shared = false;
price.sharedClass.find('updateAll',true).shared = false;
price.sharedClass.find('deleteById',true).shared = false;
price.sharedClass.find('count',true).shared = false;
price.sharedClass.find('updateAttributes',false).shared = false;