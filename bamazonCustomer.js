var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});
connection.connect(function(err) {
    if (err) throw err;
    runSearch();

});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Choose one of the following?",
            choices: [
                "Display all the products",
                "Enter the ID of the product you would like to buy.",
                //"How many units of the product you would like to buy.",
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "Display all the products":
                    displayAll();
                    break;

                case "Enter the ID of the product you would like to buy.":
                    displaySelecetedId();
                    break;

                    // case "How many units of the product you would like to buy.":
                    //     numberOfProduct();
                    // break;
            }
        });
}

function displayAll() {
    var sql = "SELECT * FROM products"; //select all from table product
    connection.query(sql, function(err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            console.log(
                "Item_id: " +
                result[i].item_id +
                " || Product Name: " +
                result[i].product_name +
                " || Department Name: " +
                result[i].department_name +
                " || Price: " +
                result[i].price +
                " || Stock Quantity: " +
                result[i].stock_quantity
            );
        }
        //console.log(result);
    });
    setTimeout(function() { runSearch() }, 100);
}

function displaySelecetedId() {
    inquirer
        .prompt({
            name: "item_id",
            type: "input",
            message: "Please enter the Id number you want to purchase!"
        })
        .then(function(answer) {
            //console.log(answer.item_id);
            connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: answer.item_id }, function(err, result) {
                if (err) throw err;
                console.log(result);
            });
            numberOfProduct(answer.item_id);
        });
}

function numberOfProduct(itemId) {
    inquirer
        .prompt({
            name: "numberOfProduct",
            type: "input",
            message: "How many units of the product you would like to buy?"
        })

        .then(function numberOfProduct(answer) {

            connection.query("SELECT stock_quantity,price FROM products WHERE ? ", { item_id: itemId },
                function(err, result) {
                    //console.log('results ' + JSON.stringify(result, null, 2));
                    //console.log(answer);
                    if (result[0].stock_quantity < answer.numberOfProduct) {
                        console.log("Insufficient quantity!")
                        setTimeout(runSearch, 1000);
                    } else {
                        connection.query("UPDATE products SET ? WHERE ? ", [{
                                stock_quantity: result[0].stock_quantity - answer.numberOfProduct
                            },
                            {
                                item_id: itemId
                            }
                        ], function(err, result1) {
                            if (err) throw err;
                            // console.log('result1 ' + JSON.stringify(result1, null, 2));
                            var totalCost=result[0].price*answer.numberOfProduct;
                            console.log("your total cost is: " + totalCost);
                            //console.log("thank you! Your items are shipped soon")
                            //setTimeout(runSearch, 1000);
                            process.exit(); //exit after purchase
                        });
                    }
                    });


                //setTimeout(function() { runSearch() }, 100);
                //runSearch();
            
            //function check()
        });
};

// function check() {
//     if (result[0].stock_quantity < answer.numberOfProduct) {
//         console.log("Insufficient quantity!")
//     } else {
//         connection.query("UPDATE products SET ? WHERE ? ", [{
//                 stock_quantity: result[0].stock_quantity - answer.numberOfProduct
//             },
//             {
//                 item_id: itemId
//             }
//         ], function(err, result) {
//             if (err) throw err;
//             console.log("thank you! Your items are shipped soon")
//         });
//     }
// }