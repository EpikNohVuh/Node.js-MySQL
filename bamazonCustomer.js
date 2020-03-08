var inquirer = require("inquirer");
var mysql = require("mysql");
const Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "Sharon",
  password: "pelouzeK5!",
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

    inquirer.prompt([{
      name: 'product',
      type: 'input',
      message: "What is the ID of the item you would like to purchase?"
    },
    {
      name: "quantity",
      type: 'input',
      message: "How many would you like to purchase?"
    }]);



  });


};

