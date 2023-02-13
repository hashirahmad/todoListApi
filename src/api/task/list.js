/**
 * @api {get} /v1/task/list List all Tasks
 * @apiName /v1/task/list
 * @apiGroup Task
 * @apiPermission none
 *
 * @apiDescription This will get a list of the tasks stored in the system and allow filtering alongside sorting.
 * 
 * 
 * @apiParam {String}	[name=""]	   Filter by task name.
 * @apiParam {String}	[status=""]	   Filter by task status. Must be one of:
 * - `CREATED`
 * - `IN_PROGRESS`
 * - `DONE`
 * - `OVERDUE`
 * @apiParam {String}	[sortBy=""]	   Sort tasks by. Must be one of:
 * - `epochStarted`
 * - `epochDue`
 * - `epochDone`
 * @apiParam {Boolean}	[ascending=false] Sort in the descending/ascending order. Applicable only alongside `sortBy` field.
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
const listTask = require('../../logic/task/list')

module.exports = (url) => {
    app.get(url, async (req, res, next) => {
        /** Get all params */
        const name = restify.getAsStringAlphanumeric(
            req,
            'name',
            '',
            false,
            255
        )
        const status = restify.getAsStringAlphanumeric(
            req,
            'status',
            '',
            false,
            20
        )
        const sortBy = restify.getAsStringAlphanumeric(
            req,
            'sortBy',
            '',
            false,
            20
        )
        const ascending = restify.getAsBoolean(req, 'ascending', false)

        const response = await listTask.list({
            name,
            status,
            sortBy,
            ascending,
        })
        restify.ok(req, res, next, response)
    })
}
