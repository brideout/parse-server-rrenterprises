
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


 Parse.Cloud.define("averageStars", function(request, response) {
  var Review = Parse.Object.extend("Review");
  var query = new Parse.Query(Review);
  query.equalTo("movie", request.params.movie);
  query.find().then(function(results) {
    var sum = 0;
    for (var i = 0; i < results.length; ++i) {
      sum += results[i].get("stars");
    }
    response.success(sum / results.length);
  }, function(error) {
    response.error("movie lookup failed");
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
