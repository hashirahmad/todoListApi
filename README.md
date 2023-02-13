# To Do List API

## Brief

What you will do:
Create endpoints for a to-do list API management: create, edit, delete, list, mark as to-do/done, filter by status, sort by dates

1. create a new MongoDB database: “todoList”
2. create a new MongoDB collection: tasks
3. define data structure for MongoDB documents in tasks collection (according to requirements below)
4. create endpoints w/ NodeJS and express to:
  a. create a task
  b. list all tasks
  c. edit a task
  d. delete a task
  e. mark a task as to-do/done
  f. filter tasks by status
  g. search tasks by name
  h. sort tasks by dates
    - start date
    - due date
    - done date

Create endpoints for projects management, tasks can now be assigned to a project

1. create a new MongoDB collection: projects
2. define data structure for MongoDB documents in projects collection (according to requirements below)
3. create endpoints w/ NodeJS and express to:
    a. create a project
    b. list all projects
    c. edit a project
    d. delete a project
4. assign a task to a project
5. filter tasks by project name
6. sort projects by dates
    a. start date
    b. due date

BONUS: (save in a separate .js file)

1. Write a mongo aggregation that returns all the projects that have a task with a due date set to “today”
2. Write a mongo aggregation that returns all the tasks that have a project with a due date set to “today”

## How to run

- Run `npm i`
- Run `npm run dev`
- Open a browser and go to this [page](http://localhost:5000/docs)
- Navigate to the appropriate API to interact with the relevant API.
