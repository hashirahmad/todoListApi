/**
 * @api {post} /v1/task/edit Edit a Task
 * @apiName /v1/task/edit
 * @apiGroup Task
 * @apiPermission none
 *
 * @apiDescription This will edit a task.
 *
 * @apiParam {String}	id	            Task ID which we are trying to edit.
 * @apiParam {String}	[name]	        Task name.
 * @apiParam {Number}	[epochDue]	    Epoch when task will be due.
 * @apiParam {Number}	[epochStarted]	Epoch when task was started.
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
        const name = restify.getAsStringAlphanumeric(
            req,
            'name',
            '',
            false,
            255
        )
        const epochDue = restify.getAsNumber(req, 'epochDue', 0, false)
        const epochStarted = restify.getAsNumber(req, 'epochStarted', 0, false)

        const response = await editTask.edit({
            id,
            name,
            epochDue,
            epochStarted,
        })
        restify.ok(req, res, next, response)
    })
}
