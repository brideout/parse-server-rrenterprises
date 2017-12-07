
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
  var Order = Parse.Object.extend("Orders");
  var object = new Order();
  // var query = new Parse.Query(Order);
  // query.equalTo("storeName", request.params.movie);
  // query.find({
    var giftCardOnlyOrdersCount = 0;
    var giftCardOrdersCount = 0;

    object.set('orderId', request.params.id);
    object.set('subTotal', request.params.subtotal_price);
    object.set('grandTotal', request.params.total_price);
    object.set('orderNumber', request.params.order_number);
    object.set('note', request.params.note);
    var lineItems = request.params.line_items;
    var skus = [];
    var giftCard = [];
    for(var x=0;x<lineItems.length;x++){
        if(lineItems[x].gift_card === true) {
            giftCard.push(true);
        } else {
            giftCard.push(false);
        }
        skus.push(lineItems[x].sku);
    }
    if(giftCard.indexOf('false') === -1) {
        object.set("inShopworks", 1);
        object.set("giftCard", 1);
    } else if(giftCard.indexOf('true') > -1) {
        object.set("giftCard", 1);
        giftCardOrdersCount = giftCardOrdersCount + 1;
    }
    object.set('sku', skus);
    if (typeof request.params.customer !== 'undefined') {
        var customerArray = [];
        for(var i = 0; i < request.params.customer.length; i++) {
            customerArray.push(request.params.customer[i]);
        }
        object.set("customer", customerArray);
    } else {
        object.set("customer", ["no"]);
    }
    object.set("discountCode", request.params.discount_codes);
    object.set("totalDiscounts", request.params.total_discounts);
    if(typeof request.params.shipping_address !== 'undefined') {
        var shippingAddressArray = [];
        for(var s=0;s<request.params.shipping_address.length; s++) {
//             shippingAddressArray.push(request.params.shipping_address[s][name]);
          shippingAddressArray.push("hi");
        }
        object.set('shippingAddress', shippingAddressArray);
        object.set('shippingLines', request.params.shipping_lines);
    } else {
        object.set("shippingAddress", ["no"]);
        object.set("shippingLines", ["no"]);
    }
    if(typeof request.params.tax_lines !== 'undefined') {
        object.set('taxes', request.params.tax_lines);
    } else {
        object.set('taxes', ["no"]);
    }
//     object.set("storeName", store);
    object.set('gateway', request.params.payment_gateway_names);
    object.set("lineItems", request.params.line_items);
    object.save(null, {
        success: function(object){
            var text = object.get('text');
            response.success();
        },
        error: function(object){
            console.log("Error: " + error.code + " " + error.message);
            response.error('query error: '+ error.code + " : " + error.message);
        }
    });
    // success: function(results){
    //   if(results.length>0){
    //     var user = results[0];
    //     user.set("ExpirationDate","hi");
    //   //   user.save(null, { useMasterKey: true }).then(
    //   //       function(result){
    //   //         response.success();
    //   //       },
    //   //       function(error){
    //   //           console.log("Error: " + error.code + " " + error.message);
    //   //         response.error('query error: '+ error.code + " : " + error.message);
    //   //       });
    //   // }
    // },
    // error: function(error){
    //         response.error('query error: '+ error.code + " : " + error.message);
    // }

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
