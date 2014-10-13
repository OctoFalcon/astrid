var app = require('../../server/server');
var ds = app.dataSources.db;
var products = ds.getModel ('product');
        
// Hiding the existing remote methods.
products.sharedClass.find('create',true).shared = false;
products.sharedClass.find('upsert',true).shared = false;
products.sharedClass.find('exists',true).shared = false;
products.sharedClass.find('findById',true).shared = false;
products.sharedClass.find('find',true).shared = false;
products.sharedClass.find('findOne',true).shared = false;
products.sharedClass.find('updateAll',true).shared = false;
products.sharedClass.find('deleteById',true).shared = false;
products.sharedClass.find('count',true).shared = false;
products.sharedClass.find('updateAttributes',false).shared = false;
module.exports = function(product){ 
    
    product.productTrans = function(id, cb){ 
        // console.log(id);
        var productClass = app.models.product;
        var productObj = new productClass();

        var priceClass = app.models.price;
        var priceObj = new priceClass();

        var skuClass = app.models.sku;
        var skuObj = new skuClass();

        var skuAttributesClass = app.models.attribute;
        var skuValuesClass = app.models.value;
        
        var productHandler = app.models.productHandler;
        productHandler.findProductById(id ,function(err, productRes){
            if(productRes){
                var productView = productRes.CatalogEntryView;
                if(productView){
                    productView.forEach(function(product){
                        productObj.identifier = product.uniqueID;
                        productObj.name = product.name;
                        productObj.shortDesc = product.shortDescription;
                        productObj.longDesc = product.longDescription;
                        productObj.parentCategoryId = [product.parentCategoryID];
                        productObj.partNumber = product.partNumber;
                        productObj.productType = product.productType;
                        productObj.metaKeyword = product.metaKeyword;
                        productObj.metaDesc = product.metaDescription;
                        productObj.title = product.title;
                        productObj.thumbnail = product.thumbnail;
                        productObj.fullImage = product.fullImage;
                        productObj.altImageText = product.fullImageAltDescription;
                        productObj.numberOfSKU = product.numberOfSKUs;

                        var prodPrices = product.Price;
                        if(prodPrices){
                            prodPrices.forEach(function(prodPrice){
                                priceObj.unitPrice = prodPrice.priceValue;
                                priceObj.priceDesc = prodPrice.priceDescription;
                                priceObj.priceUsage = prodPrice.priceUsage;
                                priceObj.priceValue = prodPrice.priceValue;
                            });
                        }
                        
                        productObj.Price = priceObj;

                        var skus = product.SKUs;
                        if(skus){
                            skus.forEach(function(sku){
                                var skusAttrs = sku.Attributes;
                                var skuAttrs = [];
                                if(skusAttrs){
                                    skusAttrs.forEach(function(skuAttr){
                                        var skuAttributesObj = new skuAttributesClass();
                                        var skuValuesObj = new skuValuesClass();
                                        var skuAttrVals = skuAttr.Values;
                                        if(skuAttrVals){
                                            skuAttrVals.forEach(function(skuAttrVal){
                                                skuValuesObj.values = [skuAttrVal.values];
                                            });
                                        }
                                        skuAttributesObj.identifier = skuAttr.name;
                                        skuAttributesObj.values = skuValuesObj;
                                        skuAttributesObj.comparable = skuAttr.comparable;
                                        skuAttributesObj.searchable = skuAttr.searchable;
                                        skuAttributesObj.displayable = skuAttr.displayable;
                                        skuAttrs.push(skuAttributesObj);
                                    });
                                }
                                skuObj.identifier = sku.SKUUniqueID;
                                var skusPrices = sku.Price;
                                if(skusPrices){
                                    skusPrices.forEach(function(skuPrice){
                                        skuObj.price = skusPrices.SKUPriceValue;    
                                    });
                                }
                                skuObj.attributes = skuAttrs;
                            });
                        
                            productObj.Sku = skuObj;
                        }

                        var attributes = product.Attributes;
                        var attrObj = [];
                        if(attributes){
                            attributes.forEach(function(attribute){
                                var attributesObj = new skuAttributesClass();
                                attributesObj.identifier = attribute.identifier;

                                attributesObj.comparable = attribute.comparable;
                                attributesObj.searchable = attribute.searchable;
                                attributesObj.displayable = attribute.displayable;
                                attrObj.push(attributesObj);
                            });
                        }
                        productObj.Attributes = attrObj;

                    });
                }
            }
            cb(null, productObj);
        });
    }

    product.searchResultsTransfrom = function(searchTerm, cb){ 
        
        var productHandler = app.models.productHandler;
        
        productHandler.findProductsBySearchTerm(searchTerm, function(err, searchRes){
            var searchArray = [];
            populateProductDetailsSummary(searchRes, searchArray, cb);
            cb(null, searchArray);
        });
    }

    product.productByIds = function(ids, cb){ 
        var productHandler = app.models.productHandler;

        if(null != ids && '' != ids) {

            var idArr = ids.split(',');

            productHandler.findByIds(idArr, function(err, data){
                var resultArr = [];
                populateProductDetailsSummary(data, resultArr, cb);
                cb(null, resultArr);
            });

        } else {
            cb(null,'At least one productId has to be specified.');
        }
        
    }

    function populateProductDetailsSummary(data, resultArr, cb) {

        var productClass = app.models.product;
        var priceClass = app.models.price;

        var productView = data.catalogEntryView;
        
        if(productView){
            productView.forEach(function(product){
                var productObj = new productClass();
                productObj.identifier = product.uniqueID;
                productObj.name = product.name;
                productObj.shortDesc = product.shortDescription;
                productObj.parentCategoryId = [product.parentCatalogGroupID];
                productObj.partNumber = product.partNumber;
                productObj.thumbnail = product.thumbnail;
                productObj.altImageText = product.fullImageAltDescription;

                var prodPrices = product.price;
                if(prodPrices){
                    prodPrices.forEach(function(prodPrice){
                        var priceObj = new priceClass();
                        priceObj.priceDesc = prodPrice.description;
                        priceObj.priceUsage = prodPrice.usage;
                        priceObj.priceValue = prodPrice.value;
                        productObj.Price = priceObj;
                    });
                }

                resultArr.push(productObj);
            });
        }
    }

    product.remoteMethod('searchResultsTransfrom', 
        { 
            returns: {arg: 'product', type: 'JSON'},
            http: {path: '/bySearchTerm', verb: 'get'},
            accepts: {arg: 'searchTerm', type: 'string', description: 'Search term or Keyword to be searched.'},
            description: 'Fetch products matching the provided search term.'
        });

    product.remoteMethod('productTrans', 
        { 
            returns: {arg: 'product', type: 'JSON'},
            http: {path: '/byProductId', verb: 'get'},
            accepts: {arg: 'id', type: 'string', description: 'ProductId to be searched.'},
            description: 'Fetch products matching the specified productId.'
        });

    product.remoteMethod('productByIds', 
        { 
            returns: {arg: 'product', type: 'JSON'},
            http: {path: '/byProductIds', verb: 'get'},
            accepts: {arg: 'ids', type: 'string', required: true, description: 'Comma separated string of ProductIds to be searched.'},
            description: 'Fetch products matching the specified productIds.'
        });
}