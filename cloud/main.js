
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.job("myJob", function(request, status) {
  // the params passed through the start request
  const params = request.params;
  // Headers from the request that triggered the job
  const headers = request.headers;

  // get the parse-server logger
  const log = request.log;

  // Update the Job status message
  status.message("I just started");
  doSomethingVeryLong().then(function(result) {
    // Mark the job as successful
    // success and error only support string as parameters
    status.success("I just finished");
  })
  .catch(function(error) {
    // Mark the job as errored
    status.error("There was an error");
  });
});

Parse.Cloud.job("saveOrder", function(request, response) {
  var Skus = Parse.Object.extend("Skus");
  var query = new Parse.Query(Skus);
  query.equalTo("storeName", request.params.movie);
  query.find({
    success: function(results){
      if(results.length>0){
        for (i = 0; i < 10000000000; i++) { 
    
          }
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

 Parse.Cloud.define("averageStars", function(request, response) {
  var Skus = Parse.Object.extend("Skus");
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
