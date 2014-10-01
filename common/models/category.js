var app = require('../../server/server');
var util = require("util");
var async = require("async");

var ds = app.dataSources.db;
var category = ds.getModel ('category');

// Hiding the existing remote methods.
category.sharedClass.find('create',true).shared = false;
category.sharedClass.find('upsert',true).shared = false;
category.sharedClass.find('exists',true).shared = false;
category.sharedClass.find('findById',true).shared = false;
category.sharedClass.find('find',true).shared = false;
category.sharedClass.find('findOne',true).shared = false;
category.sharedClass.find('updateAll',true).shared = false;
category.sharedClass.find('deleteById',true).shared = false;
category.sharedClass.find('count',true).shared = false;
category.sharedClass.find('updateAttributes',false).shared = false;

module.exports = function(category){
	category.getNavBar = function(cb){
		getTopCategoriesData(function(err, Categories){

			var asyncTasks = [];
			var categories = Categories.CatalogGroupView;
			categories.forEach(function(category){
				asyncTasks.push(function(cb){
					getSubCategoryData(category.uniqueID, cb);
				});
			});

			async.parallel(asyncTasks,
				// callback function
				function(err, data){
					if (err) {
						console.log("Error occurred: " + err);
						return;
					}
					
					buildResponse(Categories, data, cb);
				}
			)
		});
	}

	// Adding a new remote method to the model.
	category.remoteMethod(
		'getNavBar',
		{
			returns: {arg:'navbar', type: 'category'},
			http: {path: '/getNavBar', verb: 'get'},
			description: 'Fetches data to display navigation bar. Verticals and Level1 Subcategories.'
		}
	);

	function getTopCategoriesData(cb){
		// CategoryHandler is a model attached to a REST datasource.
		var categoryHandler = app.models.CategoryHandler;
		
		// Invoking the remote method.
		categoryHandler.getTopCategories(function(err, Categories){
			if (err) {
				console.log("Error occurred: " + err);
				return;
			}
			cb(null,Categories);
		})
	}

	function getSubCategoryData(categoryId, cb){
		
		var results = [];
		// CategoryHandler is a model attached to a REST datasource.
		var categoryHandler = app.models.CategoryHandler;

		// Invoking the remote method.
		categoryHandler.getCategoryByParent(categoryId, function(err, Categories){
			if (err) {
				console.log("Error occurred: " + err);
				return;
			}
			
			results.push((Categories.resourceId).substr((Categories.resourceId).lastIndexOf("/")+1));
			for (var i = 0; i < Categories.CatalogGroupView.length; i++) {
				results.push(Categories.CatalogGroupView[i].name);
			};

			cb(null,results);
		})
	}
	
	function buildResponse(Categories, SubCategories, cb){
		
			var results = [];
			
			// category is the model exposed via API and accessed via explorer.
			var destCategoryClass = app.models.category;
			var destCategoryObj = new destCategoryClass();

			for (var i = 0; i < Categories.CatalogGroupView.length; i++) {
				
				var srcCategoryObj = Categories.CatalogGroupView[i];
				
				// childCategory is a model which will be reused as a property type
				var childCategoryClass = app.models.childCategory;
				var childCategoryObj = new childCategoryClass({
					identifier: srcCategoryObj.identifier,
					name : srcCategoryObj.name,
					thumbnail : srcCategoryObj.thumbnail,
					resourceId : srcCategoryObj.resourceId,
					uniqueId : srcCategoryObj.uniqueID
				});

				for (var j = 0; j < SubCategories.length; j++) {
					if (Categories.CatalogGroupView[i].uniqueID == SubCategories[j][0]){
						SubCategories[j].shift();
						childCategoryObj.subCategoryNames = SubCategories[j];
					}
				};

				results.push(childCategoryObj);
			};
			
			destCategoryObj.childCategory = results;
			destCategoryObj.recordSetCount = i;

			cb(null,destCategoryObj);
	}

	category.getTopCategory = function(cb){
		var topCategories = [];
		var categoryClass = app.models.category;
		var categoryObj = new categoryClass();

		var childCategoryClass = app.models.childCategory;
		var categoryHandler = app.models.CategoryHandler;
		
		// Invoking the remote method.
		categoryHandler.getTopCategories(function(err, Categories){
			if (err) {
				console.log("Error occurred: " + err);
				return;
			}
			
			var categories = Categories.CatalogGroupView;
			var childCategories = [];
			// console.log(categories.length);
			categories.forEach(function(category){
				var childCategoryObj = new childCategoryClass();
				childCategoryObj.identifier = category.identifier;
				childCategoryObj.name = category.name;
				// childCategoryObj.fullImage = category.name;
				// childCategoryObj.thumbnail = category.identifier;
				// childCategoryObj.altImageText = category.identifier;
				// childCategoryObj.parentCategoryId = category.identifier;
				// childCategoryObj.resourceId = category.identifier;
				// childCategoryObj.metaKeyword = category.identifier;
				// childCategoryObj.metaDescription = category.identifier;
				// childCategoryObj.title = category.identifier;
				childCategoryObj.uniqueId = category.uniqueID;
				childCategoryObj.shortDescription = category.shortDescription;
				/*var subCatNames = [];
				childCategoryObj.subCategoryNames = subCatNames;*/
				childCategories.push(childCategoryObj);
			});
			categoryObj.childCategory = childCategories;
			categoryObj.recordSetCount = Categories.recordSetCount;
			categoryObj.recordSetStartNum = Categories.recordSetStartNumber;
			categoryObj.recordSetTotal = Categories.recordSetTotal;
			categoryObj.recordSetComplete = Categories.recordSetComplete;
			categoryObj.resourceId = Categories.resourceId;
			categoryObj.resourceName = Categories.resourceName;
			topCategories.push(categoryObj);
			// console.log(topCategories.length);
			cb(null,topCategories);
		});
	}

	category.getCategory = function(categoryId, cb){
		// var topCategories = [];
		var categoryClass = app.models.category;
		var categoryObj = new categoryClass();

		var childCategoryClass = app.models.childCategory;
		var categoryHandler = app.models.CategoryHandler;
		
		// Invoking the remote method.
		categoryHandler.getCategoryById(categoryId, function(err, Categories){
			if (err) {
				console.log("Error occurred: " + err);
				return;
			}
			
			var categories = Categories.CatalogGroupView;
			// var childCategories = [];
			// console.log(categories.length);
			categories.forEach(function(category){
				var childCategoryObj = new childCategoryClass();
				childCategoryObj.identifier = category.identifier;
				childCategoryObj.name = category.name;
				childCategoryObj.fullImage = category.fullImage;
				childCategoryObj.thumbnail = category.thumbnail;
				childCategoryObj.altImageText = category.fullImageAltDescription;
				// childCategoryObj.parentCategoryId = category.identifier;
				childCategoryObj.resourceId = category.resourceId;
				// childCategoryObj.metaKeyword = category.identifier;
				// childCategoryObj.metaDescription = category.identifier;
				// childCategoryObj.title = category.identifier;
				childCategoryObj.uniqueId = category.uniqueID;
				childCategoryObj.shortDescription = category.shortDescription;
				/*var subCatNames = [];
				childCategoryObj.subCategoryNames = subCatNames;*/
				// childCategories.push(childCategoryObj);
				categoryObj.childCategory = childCategoryObj;
			});
			categoryObj.recordSetCount = Categories.recordSetCount;
			categoryObj.recordSetStartNum = Categories.recordSetStartNumber;
			categoryObj.recordSetTotal = Categories.recordSetTotal;
			categoryObj.recordSetComplete = Categories.recordSetComplete;
			categoryObj.resourceId = Categories.resourceId;
			categoryObj.resourceName = Categories.resourceName;
			// topCategories.push(categoryObj);
			// console.log(topCategories.length);
			cb(null, categoryObj);
		});
	}

	category.remoteMethod(
		'getTopCategory',
		{
			returns: {arg:'topCategories', type: 'JSON'},
			http: {path: '/getTopCategory', verb: 'get'},
			description: 'Fetches the Verticals.'
		}
	);

	category.remoteMethod(
		'getCategory',
		{
			accepts: {arg: 'categoryId', type: 'string', description: 'CategoryId of the required Category'},
			returns: {arg:'category', type: 'JSON'},
			http: {path: '/getCategory', verb: 'get'},
			description: 'Fetches details of the Category'
		}
	);
}
