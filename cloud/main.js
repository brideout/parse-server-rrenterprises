

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

Parse.Cloud.job("test", function(request, response) {
  var duplicateIds = [];
  var Order = Parse.Object.extend("Orders");
  var query = new Parse.Query(Order);
  var currentDate = new Date(new Date().getTime());
  var day = currentDate.getDate()
  var month = currentDate.getMonth() +1
  var year = currentDate.getFullYear()
//   document.write(day + "/" + month + "/" + year)
  query.equalTo("dateOrdered","0"+ month + "/0" + day + "/" + year);
  query.equalTo("storeName", "CC");
  query.find({
    success: function(results) {
//       var object = results[0];
      var orders = [];
      var orderIds = [];
     
      for(var x=0;x<results.length;x++){ 
        if(orderIds.indexOf(results[x].orderId) === -1) {
          orderIds.push(results[x].orderId);
          orders.push(results[x]);
         } else {
           duplicateIds.push(results[x].orderId);
//            results[x].destroy({
//             success: function(myObject) {
//              response.success("Success");
//           },
//             error: function(myObject, error) {
//                console.log("Error: " + error.code + " " + error.message);
//                 response.error('query error: '+ error.code + " : " + error.message);
//           }
//           });
         }
      }
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
      response.error('query error: '+ error.code + " : " + error.message);
    }
  });
  for(var y=0;y<duplicateIds.length;y++) {
       var Orders2 = Parse.Object.extend("Orders");
      var query2 = new Parse.Query(Orders2);
      query2.equalTo("orderId", 200877113364777);
      query2.find({
        success: function(results) {
          var resultsCount = results.length;
          for(var x=0;x<resultsCount;x++){ 
            if(results[x].inShopworks !== 1 && x < resultsCount - 1) {
                 results[x].destroy({
                  success: function(myObject) {
                   response.success("Success");
                },
                  error: function(myObject, error) {
                     console.log("Error: " + error.code + " " + error.message);
                      response.error('query error: '+ error.code + " : " + error.message);
                }
                });
             }     
          }
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
          response.error('query error: '+ error.code + " : " + error.message);
        }
      });
    }
  response.success("I am done");
});

Parse.Cloud.define("testOrder", function(request, response) {
   const log = request.log;

  // Update the Job status message
//   status.message("I just started");
  console.log("hi");
  var Order = Parse.Object.extend("Orders");
  var object = new Order();
  object.set('orderId', 12345);
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
});


Parse.Cloud.define("saveOrder", function(request, response) {
  var Order = Parse.Object.extend("Orders");
  var object = new Order();
  // var query = new Parse.Query(Order);
  // query.equalTo("storeName", request.params.movie);
  // query.find({
    var giftCardOnlyOrdersCount = 0;
    var giftCardOrdersCount = 0;
    json.parse(request.params);

    object.set('orderId', request.params.id);
    object.set('subTotal', request.params.subtotal_price);
    object.set('grandTotal', request.params.total_price);
    object.set('orderNumber', request.params.order_number);
    object.set('note', request.params.note);
    var paymentGateways = request.params.payment_gateway_names;
    if(paymentGateways.indexOf("gift_card") > -1) {
       object.set("inShopworks", 1);
     }
    var lineItems = request.params.line_items;
    var skus = [];
    var giftCard = [];
    for(var x=0;x<lineItems.length;x++){
        if(lineItems[x].gift_card === true) {
            giftCard.push("true");
        } else {
            giftCard.push("false");
        }
        skus.push(lineItems[x].sku);
    }
    if(giftCard.indexOf('false') === -1) {
//         object.set("inShopworks", 1);
        object.set("giftCard", 1);
    } else if(giftCard.indexOf('true') > -1) {
        object.set("giftCard", 1);
        giftCardOrdersCount = giftCardOrdersCount + 1;
    }
    object.set('sku', skus);
    if (typeof request.params.customer !== 'undefined') {
        var customerArray = [];
        var customerInfo = request.params.customer;
        var ylength = Object.keys(customerInfo).length;
        for(var i = 0; i < ylength; i++) {
            customerArray.push(customerInfo[Object.keys(customerInfo)[i]]);
        }
        object.set("customer", customerInfo);
    } else {
        object.set("customer", ["no"]);
    }
    object.set("discountCode", request.params.discount_codes);
    object.set("totalDiscounts", request.params.total_discounts);
    if(typeof request.params.shipping_address !== 'undefined') {
        var shippingAddressArray = [];
        var shippingAddress = request.params.shipping_address; 
      var xlength = Object.keys(shippingAddress).length;
        for(var s=0; s < xlength; s++) {
            shippingAddressArray.push(shippingAddress[Object.keys(shippingAddress)[s]]);
        }
        // object.set('shippingAddress', shippingAddressArray); 2
        object.set('shippingAddress', request.params.shipping_address);
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
    object.set("dateOrdered", request.params.created_at_date);
    object.set("dateOrderedTime", request.params.dateOrderedTime);
    object.set("storeName", request.params.store);
   
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
}); 

Parse.Cloud.define("orderUpdated", function(request, response) {
  var Order = Parse.Object.extend("Orders");
  var query = new Parse.Query(Order);
  query.equalTo("orderId", request.params.id);
  query.equalTo("storeName", request.params.store);
  query.find({
    success: function(results) {
      var object = results[0];
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
          skus.push(lineItems[x].sku);
      }
      object.set('sku', skus);
      if (typeof request.params.customer !== 'undefined') {
          var customerArray = [];
          var customerInfo = request.params.customer;
          var ylength = Object.keys(customerInfo).length;
          for(var i = 0; i < ylength; i++) {
              customerArray.push(customerInfo[Object.keys(customerInfo)[i]]);
          }
          object.set("customer", customerInfo);
      } else {
          object.set("customer", ["no"]);
      }
      object.set("discountCode", request.params.discount_codes);
      object.set("totalDiscounts", request.params.total_discounts);
      if(typeof request.params.shipping_address !== 'undefined') {
          var shippingAddressArray = [];
          var shippingAddress = request.params.shipping_address; 
        var xlength = Object.keys(shippingAddress).length;
          for(var s=0; s < xlength; s++) {
              shippingAddressArray.push(shippingAddress[Object.keys(shippingAddress)[s]]);
          }
          // object.set('shippingAddress', shippingAddressArray); 2
          object.set('shippingAddress', request.params.shipping_address);
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
      object.set("storeName", request.params.store);

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
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
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

//  Parse.Cloud.define("getProducts", function (request, response) {
// //      Shopify.get('/admin/products.json', query_data, function(err, data, headers){
// //          console.log(data); // Data contains product json information
// //          console.log(headers); // Headers returned from request
// //          console.log(err);
// //      });
// Shopify.get('/admin/products.json', query_data, function(err, data, headers){
//                 console.log(data); // Data contains product json information
//                 // console.log(headers); // Headers returned from request
//             });
//      response.success();
//  });
