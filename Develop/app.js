const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Define questions
const managerQuestions = {
    type: "input",
    message: "What is their office number?",
    name: "office"
};

const engineerQuestions = {
    type: "input",
    message: "What is their github username?",
    name: "github"
};

const internQuestions = {
    type: "input",
    message: "What school do they attend?",
    name: "school"
};

const employeeType = [{
    type: "list",
    name: "type",
    message: "Please select the type of employee you woud like to add:",
    choices: ["Manager", "Engineer", "Intern"]
}];

const defaultQs = [
    {
        type: "input",
        message: "What is the employee's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is the employee's ID?",
        name: "id"
    },
    {
        type: "input",
        message: "What is the employee's email address?",
        name: "email"
    }];

const moreEmp = [{
    type: "confirm",
    message: "Would you like to add any other employees?",
    name: "continue"
}];

async function buildPage() {

    var cont = { "continue": true };

    var i = 0;
    var j = 0;
    var k = 0;
    
    var managers = [];
    var engineers = [];
    var interns = [];

    try {
        while (cont.continue) {
            var role = await inquirer.prompt(employeeType);
            var defaultAs = await inquirer.prompt(defaultQs);

            if (role.type === "Manager") {
                var office = await inquirer.prompt(managerQuestions);
                managers[i] = new Manager(defaultAs.name, defaultAs.id, defaultAs.email, office.office);
                i++;
            }
            else if (role.type === "Engineer") {
                var github = await inquirer.prompt(engineerQuestions);
                engineers[j] = new Engineer(defaultAs.name, defaultAs.id, defaultAs.email, github.github);
                j++;
            }
            else {
                var school = await inquirer.prompt(internQuestions);
                interns[k] = new Intern(defaultAs.name, defaultAs.id, defaultAs.email, school.school);
                k++;
            }
            cont = await inquirer.prompt(moreEmp);
        }
    } catch (err) {
        console.log(err);
    }

    const employees = [];
    for (var n = 0; n < managers.length; n++){
        employees.push(managers[n]);
    }
    for (var n = 0; n < engineers.length; n++){
        employees.push(engineers[n]);
    }
    for (var n = 0; n < interns.length; n++){
        employees.push(interns[n]);
    }
    
    const html = render(employees);

    fs.writeFile("team.html", html, function (err) {
        if (err) {
            error(err);
        }
        else {
            console.log("File written!");
        }
    })
}

buildPage();