
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("testJob", function(request, response) {
  var GameScore = Parse.Object.extend("Skus");
  var gameScore = new GameScore();

  gameScore.set("score", 1337);
  gameScore.set("playerName", "Sean Plott");
  gameScore.set("cheatMode", false);

  gameScore.save(null, {
    success: function(gameScore) {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + gameScore.id);
    },
    error: function(gameScore, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });
}

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
