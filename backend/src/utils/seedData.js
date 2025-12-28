const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');
const { connectMongo } = require('../config/db');

const assignments = [
  {
    title: "Select All Users",
    description: "Learn how to retrieve all records from a table.",
    difficulty: "Easy",
    topic: "Basic SQL",
    question: "Write a query to select all columns from the 'users' table.",
    sampleTables: [
      {
        tableName: "users",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "email", dataType: "TEXT" }
        ],
        rows: [
          { id: 1, name: "Alice", email: "alice@example.com" },
          { id: 2, name: "Bob", email: "bob@example.com" }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" }
      ]
    },
    setupSql: `
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, email TEXT);
      INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com');
    `,
    stats: { attempts: 0, solved: 0 }
  },
  {
    title: "Find High Earners",
    description: "Filter results using the WHERE clause.",
    difficulty: "Medium",
    topic: "Basic SQL",
    question: "Select the name and salary of employees earning more than 50000.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "salary", dataType: "INTEGER" }
        ],
        rows: [
          { id: 1, name: "Charlie", salary: 45000 },
          { id: 2, name: "Diana", salary: 60000 },
          { id: 3, name: "Evan", salary: 55000 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { name: "Diana", salary: 60000 },
        { name: "Evan", salary: 55000 }
      ]
    },
    setupSql: `
      DROP TABLE IF EXISTS employees;
      CREATE TABLE employees (id SERIAL PRIMARY KEY, name TEXT, salary INTEGER);
      INSERT INTO employees (name, salary) VALUES ('Charlie', 45000), ('Diana', 60000), ('Evan', 55000);
    `,
    stats: { attempts: 0, solved: 0 }
  },
  {
    title: "Aggegrate Salaries",
    description: "Calculate the total salary of all employees.",
    difficulty: "Medium",
    topic: "Aggregation",
    question: "Calculate the sum of all salaries from the 'employees' table.",
    sampleTables: [
        {
          tableName: "employees",
          columns: [
            { columnName: "id", dataType: "INTEGER" },
            { columnName: "name", dataType: "TEXT" },
            { columnName: "salary", dataType: "INTEGER" }
          ],
          rows: [
            { id: 1, name: "Charlie", salary: 45000 },
            { id: 2, name: "Diana", salary: 60000 },
            { id: 3, name: "Evan", salary: 55000 }
          ]
        }
      ],
      expectedOutput: {
        type: "table",
        value: [
          { sum: 160000 }
        ]
      },
      setupSql: `
        DROP TABLE IF EXISTS employees;
        CREATE TABLE employees (id SERIAL PRIMARY KEY, name TEXT, salary INTEGER);
        INSERT INTO employees (name, salary) VALUES ('Charlie', 45000), ('Diana', 60000), ('Evan', 55000);
      `,
      stats: { attempts: 0, solved: 0 }
  },
  {
    title: "Customer Orders (JOIN)",
    description: "Learn how to combine rows from two or more tables based on a related column between them.",
    difficulty: "Medium",
    topic: "Joins",
    question: "Retrieve the order_id, item, amount, and the first_name of the customer who placed the order.",
    sampleTables: [
      {
        tableName: "Customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "TEXT" },
          { columnName: "age", dataType: "INTEGER" },
          { columnName: "country", dataType: "TEXT" }
        ],
        rows: [
          { customer_id: 1, first_name: "John", age: 31, country: "USA" },
          { customer_id: 2, first_name: "Robert", age: 22, country: "USA" },
          { customer_id: 3, first_name: "David", age: 22, country: "UK" },
          { customer_id: 4, first_name: "John", age: 25, country: "UK" },
          { customer_id: 5, first_name: "Betty", age: 28, country: "UAE" }
        ]
      },
      {
        tableName: "Orders",
        columns: [
          { columnName: "order_id", dataType: "INTEGER" },
          { columnName: "item", dataType: "TEXT" },
          { columnName: "amount", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" }
        ],
        rows: [
          { order_id: 1, item: "Keyboard", amount: 400, customer_id: 4 },
          { order_id: 2, item: "Mouse", amount: 300, customer_id: 4 },
          { order_id: 3, item: "Monitor", amount: 12000, customer_id: 3 },
          { order_id: 4, item: "Keyboard", amount: 400, customer_id: 1 },
          { order_id: 5, item: "Mousepad", amount: 250, customer_id: 2 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { order_id: 1, item: "Keyboard", amount: 400, first_name: "John" },
        { order_id: 2, item: "Mouse", amount: 300, first_name: "John" },
        { order_id: 3, item: "Monitor", amount: 12000, first_name: "David" },
        { order_id: 4, item: "Keyboard", amount: 400, first_name: "John" },
        { order_id: 5, item: "Mousepad", amount: 250, first_name: "Robert" }
      ]
    },
    setupSql: `
      DROP TABLE IF EXISTS Orders;
      DROP TABLE IF EXISTS Customers;
      CREATE TABLE Customers (customer_id SERIAL PRIMARY KEY, first_name TEXT, age INTEGER, country TEXT);
      INSERT INTO Customers (customer_id, first_name, age, country) VALUES 
      (1, 'John', 31, 'USA'),
      (2, 'Robert', 22, 'USA'),
      (3, 'David', 22, 'UK'),
      (4, 'John', 25, 'UK'),
      (5, 'Betty', 28, 'UAE');

      CREATE TABLE Orders (order_id SERIAL PRIMARY KEY, item TEXT, amount INTEGER, customer_id INTEGER);
      INSERT INTO Orders (order_id, item, amount, customer_id) VALUES 
      (1, 'Keyboard', 400, 4),
      (2, 'Mouse', 300, 4),
      (3, 'Monitor', 12000, 3),
      (4, 'Keyboard', 400, 1),
      (5, 'Mousepad', 250, 2);
    `,
    stats: { attempts: 0, solved: 0 }
  },
  {
    title: "High Spenders (Subquery)",
    description: "Use a subquery to filter results based on an aggregate condition.",
    difficulty: "Hard",
    topic: "Subqueries",
    question: "Select the first_name of customers who have spent more than the average amount of all orders.",
    sampleTables: [
      {
        tableName: "Customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "TEXT" },
          { columnName: "age", dataType: "INTEGER" },
          { columnName: "country", dataType: "TEXT" }
        ],
        rows: [
          { customer_id: 1, first_name: "John", age: 31, country: "USA" },
          { customer_id: 2, first_name: "Robert", age: 22, country: "USA" },
          { customer_id: 3, first_name: "David", age: 22, country: "UK" },
          { customer_id: 4, first_name: "John", age: 25, country: "UK" },
          { customer_id: 5, first_name: "Betty", age: 28, country: "UAE" }
        ]
      },
      {
        tableName: "Orders",
        columns: [
          { columnName: "order_id", dataType: "INTEGER" },
          { columnName: "item", dataType: "TEXT" },
          { columnName: "amount", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" }
        ],
        rows: [
          { order_id: 1, item: "Keyboard", amount: 400, customer_id: 4 },
          { order_id: 2, item: "Mouse", amount: 300, customer_id: 4 },
          { order_id: 3, item: "Monitor", amount: 12000, customer_id: 3 },
          { order_id: 4, item: "Keyboard", amount: 400, customer_id: 1 },
          { order_id: 5, item: "Mousepad", amount: 250, customer_id: 2 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { first_name: "David" }
      ]
    },
    setupSql: `
      DROP TABLE IF EXISTS Orders;
      DROP TABLE IF EXISTS Customers;
      CREATE TABLE Customers (customer_id SERIAL PRIMARY KEY, first_name TEXT, age INTEGER, country TEXT);
      INSERT INTO Customers (customer_id, first_name, age, country) VALUES 
      (1, 'John', 31, 'USA'),
      (2, 'Robert', 22, 'USA'),
      (3, 'David', 22, 'UK'),
      (4, 'John', 25, 'UK'),
      (5, 'Betty', 28, 'UAE');

      CREATE TABLE Orders (order_id SERIAL PRIMARY KEY, item TEXT, amount INTEGER, customer_id INTEGER);
      INSERT INTO Orders (order_id, item, amount, customer_id) VALUES 
      (1, 'Keyboard', 400, 4),
      (2, 'Mouse', 300, 4),
      (3, 'Monitor', 12000, 3),
      (4, 'Keyboard', 400, 1),
      (5, 'Mousepad', 250, 2);
    `,
    stats: { attempts: 0, solved: 0 }
  }
];

const seedDB = async () => {
  await connectMongo();
  
  await Assignment.deleteMany({});
  await Assignment.insertMany(assignments);
  
  console.log("✅ Database Seeded Successfully");
  process.exit();
};

seedDB();
