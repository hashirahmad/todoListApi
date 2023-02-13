/**
 * @api {post} /v1/task/delete Delete a Task
 * @apiName /v1/task/delete
 * @apiGroup Task
 * @apiPermission none
 *
 * @apiDescription This will delete a task.
 *
 * @apiParam {String}	id	            Task ID which we are trying to delete.
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
const editTask = require('../../logic/task/edit')

module.exports = async (url) => {
    app.post(url, async (req, res, next) => {
        const id = restify.getAsStringAlphanumeric(req, 'id', '', true, 50)

        const response = await editTask.delete({ id })
        restify.ok(req, res, next, response)
    })
}
