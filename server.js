const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_tracker_db',
    },
        
    );



db.connect(function (err) {
    if (err) throw err;
    // this is the ascii art splash title
    console.log(`    ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
    ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
    █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
    ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
    ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
    ╚═══████████╗██████╗═╝█████╗══██████╗██╗══██╗███████╗██████╗╝╚══════╝
        ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗        
           ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝        
           ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗        
           ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║        
           ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`)
    // run the startTracker function after the connection is successful to show prompts to user
    startTracker();
  });




        // function to start the prompts
        function startTracker() {
            inquirer
                .prompt({
                    name: 'action',
                    type: 'list',
                    message: 'What would you like to do?',
                    choices: [
                        'View all employees',
                        'View all departments',
                        'View all roles',
                        'Add employee',
                        'Add department',
                        'Add role',
                        'Update employee role',
                        'Exit'
                    ],

                })
                .then(function (answer) {
                    switch (answer.action) {
                        case 'View all employees':
                            viewEmployees();
                            break;
                        case 'View all departments':
                            viewDepartments();
                            break;
                        case 'View all roles':
                            viewRoles();
                            break;
                        case 'Add employee':
                            addEmployee();
                            break;
                        case 'Add department':
                            addDepartment();
                            break;
                        case 'Add role':
                            addRole();
                            break;
                        case 'Update employee role':
                            updateEmployeeRole();
                            break;       
                        case 'Exit':
                            db.end();
                            process.exit();
                            break;
                    }
                });
        }
    

        

        // function to view all employees
        function viewEmployees() {
            db.query('SELECT * FROM employee', function (err, results) {
                console.table(results);
                startTracker();
            });
        }

        // function to view all departments
        function viewDepartments() {
            db.query('SELECT * FROM department', function (err, results) {
                console.table(results);
                startTracker();
            });
        }

        // function to view all roles
        function viewRoles() {
            db.query('SELECT * FROM role', function (err, results) {
                console.table(results);
                startTracker();
            });
        }

        // function to add an employee
        function addEmployee() {
            inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the employee\'s first name:',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the employee\'s last name:',
                },
                {
                    name: 'role_id',
                    type: 'input',
                    message: 'Enter the employee\'s role ID:',
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: 'Enter the employee\'s manager ID:',
                },
            ])
                .then(function (answer) {
                db.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id || null
                },
                function (err, results) {
                    if (err) throw err;
                    console.log('Employee added successfully!');
                    startTracker();
                });
            });
        }
            

        // function to add a department
        function addDepartment() {
            inquirer
            .prompt([
                {
                    name: 'name',
                    type: 'input',
                    message: 'Enter the department name:',
                },
            ])
                .then(function (answer) {
                db.query('INSERT INTO department SET ?',
                {
                    name: answer.name,
                },
                function (err, results) {
                    if (err) throw err;
                    console.log('Department added successfully!');
                    startTracker();
                });
            });
        }

        // function to add a role
        function addRole () {
            inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the role title:',
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the role salary:',
                },
                {
                    name: 'department_id',
                    type: 'input',
                    message: 'Enter the role department ID:',
                },
            ])
                .then(function (answer) {
                db.query('INSERT INTO role SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                function (err, results) {
                    if (err) throw err;
                    console.log('Role added successfully!');
                    startTracker();
                });
            });
        }


        // function to update an employee role
        function updateEmployeeRole() {
            inquirer
            .prompt([
                {
                    name: 'employee_id',
                    type: 'input',
                    message: 'Enter the employee ID:',
                },
                {
                    name: 'role_id',
                    type: 'input',
                    message: 'Enter the new role ID:',
                },
            ])
                .then(function (answer) {
                db.query('UPDATE employee SET role_id = ? WHERE id = ?',
                [answer.role_id, answer.employee_id],
                function (err, results) {
                    if (err) throw err;
                    console.log('Employee role updated successfully!');
                    startTracker();
                });
            });
        }

    



        app.listen(PORT, () => {
            ;
        }); 
    
