var request = require('request');
var app = require('../../server/server');

module.exports = function(productHandler){ 
    productHandler.findByIds = function(ids, cb){ 
       uri = 'http://localhost/search/resources/store/10001/productview/byIds?';
       for(var i=0; i < ids.length; i++){
            // console.log('p=',ids[i]);
            uri += 'id='+ids[i]+'&';
        }
        uri = uri.substring(0, uri.length-1);
        // console.log(uri); 
        request.get({
            url: uri,
            method: 'GET',
        }, function(err, response) {
            if (err) console.error(err);
            // console.log('Result',response);
            cb(null, JSON.parse(response.body));
        });
    }

    productHandler.productTrans = function(id, cb){ 
        // console.log(id);
        var productClass = app.models.product;
        var productObj = new productClass();

        var priceClass = app.models.price;
        var priceObj = new priceClass();

        var skuClass = app.models.sku;
        var skuObj = new skuClass();

        var attachmentsClass = app.models.attachment;
        var attachmentsObj = new attachmentsClass();

        var skuAttachmentsClass = app.models.attachment;
        var skuAttachmentsObj = new skuAttachmentsClass();

        var skuAttributesClass = app.models.attribute;
        var skuAttributesObj = new skuAttributesClass();

        var skuValuesClass = app.models.value;
        var skuValuesObj = new skuValuesClass();

        var attributesClass = app.models.attribute;

        var attrValuesClass = app.models.value;

        var valuesClass = app.models.value;
        var valuesObj = new valuesClass();

        productHandler.findProductById(id, function(err, productRes){
            var productView = productRes.CatalogEntryView;
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
                productObj.inventory = "dummy inventory";
                productObj.numberOfSKU = product.numberOfSKUs;

                var prodPrices = product.Price;
                prodPrices.forEach(function(prodPrice){
                    priceObj.unitPrice = prodPrice.priceValue;
                    priceObj.productId = product.uniqueID;
                    priceObj.partNumber = product.partNumber;
                    priceObj.resourceId = productRes.resourceId;
                    priceObj.resourceName = productRes.resourceName;
                    priceObj.priceDesc = prodPrice.priceDescription;
                    priceObj.priceUsage = prodPrice.priceUsage;
                    priceObj.priceValue = prodPrice.priceValue;
                });
                
                productObj.Price = priceObj;

                skuAttachmentsObj.mimeType = "dummy attachment mimeType";
                skuAttachmentsObj.path = "dummy attachment path";
                skuAttachmentsObj.identifier = "dummy attachment identifier";
                skuAttachmentsObj.metadata = ["dummy attachment metadata"];

                var skus = product.SKUs;
                skus.forEach(function(sku){
                    var skusAttrs = sku.Attributes;
                    skusAttrs.forEach(function(skuAttr){
                        var skuAttrVals = skuAttr.Values;
                        skuAttrVals.forEach(function(skuAttrVal){
                            skuValuesObj.values = [skuAttrVal.values];
                            skuAttributesObj.identifier = skuAttrVal.identifier;
                        });
                        
                        skuValuesObj.metadata = ["dummy value metadata"];
                        skuAttributesObj.values = skuValuesObj;
                        skuAttributesObj.comparable = skuAttr.comparable;
                        skuAttributesObj.searchable = skuAttr.searchable;
                        skuAttributesObj.displayable = skuAttr.displayable;
                        skuAttributesObj.metadata = ["dummy metadata"];
                    });
                    
                    skuObj.identifier = sku.SKUUniqueID;
                    var skusPrices = sku.Price;
                    skusPrices.forEach(function(skuPrice){
                        skuObj.price = skusPrices.SKUPriceValue;    
                    });
                    skuObj.attachments = skuAttachmentsObj;
                    skuObj.attributes = skuAttributesObj;
                    skuObj.metadata = ["dummy metadata"];
                });
                
                productObj.Sku = skuObj;

                attachmentsObj.mimeType = "dummy attachment mimeType";
                attachmentsObj.path = "dummy attachment path";
                attachmentsObj.identifier = "dummy attachment identifier";
                attachmentsObj.metadata = ["dummy attachment metadata"];
                productObj.Attachments = attachmentsObj;
                
                var attributesObj = new attributesClass();
                var attributes = product.Attributes;
                // var attrObj = [];
                attributes.forEach(function(attribute){
                    
                    var attrValuesObj = new attrValuesClass();
                    attributesObj.identifier = attribute.identifier;

                    attrValuesObj.values = ["dummy values"];
                    attrValuesObj.metadata = ["dummy values"];
                    attributesObj.values = attrValuesObj;

                    attributesObj.comparable = attribute.comparable;
                    attributesObj.searchable = attribute.searchable;
                    attributesObj.displayable = attribute.displayable;
                    attributesObj.metadata = ["dummy metadata"];
                    // attrObj.push(attributesObj);
                });
                // productObj.Attributes = attrObj;
                productObj.Attributes = attributesObj;

                valuesObj.values = ["dummy values"];
                valuesObj.metadata = ["dummy value metadata"];
                productObj.Values = valuesObj;
            });
            
            cb(null, productObj);
        });
    }
    productHandler.searchResultsTransfrom = function(searchTerm, cb){ 
        // console.log(searchTerm);
        var productClass = app.models.product;

        var priceClass = app.models.price;
        var priceObj = new priceClass();

        var skuClass = app.models.sku;
        var skuObj = new skuClass();

        var attachmentsClass = app.models.attachment;
        var attachmentsObj = new attachmentsClass();

        var skuAttachmentsClass = app.models.attachment;
        var skuAttachmentsObj = new skuAttachmentsClass();

        var skuAttributesClass = app.models.attribute;
        var skuAttributesObj = new skuAttributesClass();

        var skuValuesClass = app.models.value;
        var skuValuesObj = new skuValuesClass();

        var attributesClass = app.models.attribute;

        var attrValuesClass = app.models.value;

        var valuesClass = app.models.value;
        var valuesObj = new valuesClass();

        productHandler.findProductsBySearchTerm(searchTerm, function(err, searchRes){
            var productView = searchRes.catalogEntryView;
            // console.log(productView.length);
            var searchArray = [];
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
                prodPrices.forEach(function(prodPrice){
                    priceObj.priceDesc = prodPrice.description;
                    priceObj.priceUsage = prodPrice.usage;
                    priceObj.priceValue = prodPrice.value;
                });
                
                productObj.Price = priceObj;

                searchArray.push(productObj);
            });
            
            cb(null, searchArray);
        });
    }
        
    productHandler.remoteMethod('findByIds', 
        { 
            returns: {arg: 'productHandler', type: 'JSON'},
            http: {path: '/findByIds', verb: 'get'},
            accepts: {arg: 'ids', type: 'array'}
        });

    productHandler.remoteMethod('searchResultsTransfrom', 
        { 
            returns: {arg: 'product', type: 'JSON'},
            http: {path: '/searchResultsTransfrom', verb: 'get'},
            accepts: {arg: 'searchTerm', type: 'string'}
        });

    productHandler.remoteMethod('productTrans', 
        { 
            returns: {arg: 'product', type: 'JSON'},
            http: {path: '/productTrans', verb: 'get'},
            accepts: {arg: 'id', type: 'string'}
        });
}