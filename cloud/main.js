
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


 Parse.Cloud.define("averageStars", function(request, response) {
  var Review = Parse.Object.extend("Skus");
  var query = new Parse.Query(Skus);
  query.equalTo("storeName", request.params.movie);
  query.find({
    success: function(results){
      if(results.length>0){
        var user = results[0];
        user.set("ExpirationDate","hi");
        user.save(null, { useMasterKey: true }).then(
            function(result){
              response.success();
            },
            function(error){
                console.log("Error: " + error.code + " " + error.message);
              response.error('query error: '+ error.code + " : " + error.message);
            });
      }
    },
    error: function(error){
            response.error('query error: '+ error.code + " : " + error.message);
    }
  });
});                  

Parse.Cloud.define("updateExpDate", function(request, response){
  var query = new Parse.Query(Parse.User);
  query.equalTo('customer_id', request.params.customerId);
  query.find({
    success: function(results){
      if(results.length>0){
        var user = results[0];
        user.set("ExpirationDate",[request.params.ExpirationDate]);
        user.save(null, { useMasterKey: true }).then(
            function(result){
              response.success();
            },
            function(error){
                console.log("Error: " + error.code + " " + error.message);
              response.error('query error: '+ error.code + " : " + error.message);
            });
      }
    },
    error: function(error){
            response.error('query error: '+ error.code + " : " + error.message);
    }
  });
});
