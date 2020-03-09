var inquirer = require("inquirer");
var mysql = require("mysql");
const Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "",
  password: "!",
  database: "BAMAZON_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayProducts();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    let table = new Table({

      head: ['Product ID', 'Description', 'Department', 'Price Each', 'Stock On Hand'],
      colWidths: [12, 35, 16, 12, 8]

    });

    for (let i = 0; i < res.length; i++) {

      table.push([res[i].PRODUCTID, res[i].PRODUCT_NAME, res[i].DEPARTMENT_NAME, res[i].PRICE, res[i].STOCK])
    };

    console.log(table.toString());

    inquirer.prompt(
      [
        {
          name: 'product',
          type: 'input',
          message: "What is the ID of the item you would like to purchase?"
        },
        {
          name: "quantity",
          type: 'input',
          message: "How many would you like to purchase?"
        }
      ]).then(function (answer) {
        if (err) throw err;
        var product = answer.product;
        var quantity = answer.quantity;

        connection.query('SELECT * FROM products WHERE ?', [{ PRODUCTID: answer.product }], function (err, res) {
          if (err) throw err;

          if (res[0].STOCK >= answer.quantity) {
            var subTotal = answer.quantity * res[0].PRICE;
            console.log(res[0].STOCK);
            console.log("* * * * * B A M A Z O N   R E C E I P T * * * * *");
            console.log("You purchased " + answer.quantity + " " + res[0].PRODUCT_NAME + " @ " + res[0].PRICE + " each ");
            console.log("Your total is: " + subTotal)
            console.log("* * * * T H A N K  Y O U,  C O M E  A G A I N  * * * ")
            var updatedStock = res[0].STOCK - quantity;
            console.log(updatedStock);
            var query = connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  STOCK: updatedStock
                },
                {
                  PRODUCTID: answer.product
                }
              ]);


          } else {
            console.log("Insufficient Quantity. Please adjust your order, we only have " + res[0].STOCK + " of " + res[0].PRODUCT_NAME + ".");
            tryAgain()
          };
        }
        )
      })
  });
};

function tryAgain() {
  
  inquirer.prompt([
    {
      name: 'tryAgain',
      type: 'input',
      message: "Would you like to make another purchase?"
    }
  ]).then(function(answer){
    if (err) throw err;
var tryAgain = answer.tryAgain;
if(tryAgain==="Y"){
  displayProducts()
} else {
  console.log("Thank you for shopping Bamazon!");
  connection.end();
}

  })

}