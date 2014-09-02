var app = require('../../server/server');
var util = require("util");

module.exports = function(category){
	category.getNavBar = function(cb){

		var results = [];
		// CategoryHandler is a model attached to a REST datasource.
		var categoryHandler = app.models.CategoryHandler;
		
		// Invoking the remote method.
		categoryHandler.getTopCategories(function(err,Categories){
			if (err) {
				console.log("Error occurred: " + err);
				return;
			}

			for (var i = 0; i < Categories.CatalogGroupView.length; i++) {
				
				var srcCategoryObj = Categories.CatalogGroupView[i];
				// category is the model exposed via API and accessed via explorer.
				var destCategoryObj = app.models.category;
				// childCategory is a model which will be reused as a property type
				var childCategoryObj = app.models.childCategory;
				
				// Assigning values to properties of childCategory
				childCategoryObj.identifier = srcCategoryObj.identifier;
				childCategoryObj.name = srcCategoryObj.name;
				childCategoryObj.thumbnail = srcCategoryObj.thumbnail;
				childCategoryObj.resourceId = srcCategoryObj.resourceId;
				childCategoryObj.uniqueId = srcCategoryObj.uniqueID;
				
				destCategoryObj.childCategory = childCategoryObj;
				destCategoryObj.recordSetCount = 6;
				
				results.push(util.inspect(destCategoryObj));
			};
			//console.log(results[0]);
			cb(null,results);
	    });
	}

	// Adding a new remote method to the model.
	category.remoteMethod(
		'getNavBar',
		{
			returns: {arg:'navbar', type: 'category'},
			http: {path: '/getNavBar', verb: 'get'}
		}
	);
}