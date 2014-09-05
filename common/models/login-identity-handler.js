var request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = function(LoginIdentityHandler){
    //  Response from commerce
	/*
    LoginIdentityHandler.authentication = function(logonId, logonPassword, cb) {
	
		var uri = 'https://localhost/wcs/resources/store/10151/loginidentity';
        console.log(uri); 
        request({
            url: uri,
		
			method: 'POST',
			json:{
			"logonId" : logonId,
			"logonPassword" : logonPassword
			}
			
        }, function(err, response) {
            if (err) console.error(err);
            //console.log('Result'+JSON.stringify(response.body));
            cb(null, response.body);
        });	
		
	 
    } 
	*/
	
	
	//Response from stub:
	
	LoginIdentityHandler.authentication = function(logonId, logonPassword, cb) {
	
        var uri = 'http://restfalcon.mybluemix.net/loginidentity/7';
        console.log(uri); 
        request({
            url: uri,
            method: 'GET',						
        }, function(err, response) {
            if (err) console.error(err);
           // console.log('Result'+JSON.stringify(response.body));
			cb(null, JSON.parse(response.body));
        });	
		
	 
    }
     
    LoginIdentityHandler.remoteMethod(
        'authentication', 
        {
          accepts: [{arg: 'logonId', type: 'string'}, {arg: 'logonPassword', type: 'string'}],
          returns: {arg: 'authentication', type: 'string'},
        }
    );
};

