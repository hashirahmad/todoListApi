/**
 * @api {post} /v1/task/create Create a Task
 * @apiName /v1/task/create
 * @apiGroup Task
 * @apiPermission none
 *
 * @apiDescription This will create a task.
 *
 * @apiParam {String}	name	        Task name.
 * @apiParam {Number}	epochDue	    Epoch when task will be due.
 *
 * @apiSuccess {string}   status        ok

@apiSuccessExample {json} Success As an overall count
{
}
@apiSuccessExample {json} Success As a list
{
}
@apiErrorExample {json} EXAMPLE_ERR
{
    error: 'EXAMPLE_ERR',
    details: { hello: "world" },
    userMessage: `Hello there! Erm . . . something went wrong!!!`,
}
*/
const app = require('../../app')
const restify = require('../../helpers/restifyHelpers')
const createTask = require('../../logic/task/create')

module.exports = async (url) => {
    app.post(url, async (req, res, next) => {
        const name = restify.getAsStringAlphanumeric(req, 'name', '', true, 255)
        const epochDue = restify.getAsNumber(req, 'epochDue', '', true)

        const response = await createTask.create({ name, epochDue })
        restify.ok(req, res, next, response)
    })
}
