/**
 * @api {get} /v1/project/list List all Projects
 * @apiName /v1/project/list
 * @apiGroup Project
 * @apiPermission none
 *
 * @apiDescription This will get a list of the projects stored in the system and allow filtering alongside sorting.
 * 
 * 
 * @apiParam {String}	[name=""]	   Filter by project name.
 * @apiParam {String}	[status=""]	   Filter by project status. Must be one of:
 * - `CREATED`
 * - `IN_PROGRESS`
 * - `DONE`
 * - `OVERDUE`
 * @apiParam {String}	[sortBy=""]	   Sort Projects by. Must be one of:
 * - `epochStarted`
 * - `epochDue`
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
const listProject = require('../../logic/project/list')

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

        const response = await listProject.list({
            name,
            status,
            sortBy,
            ascending,
        })
        restify.ok(req, res, next, response)
    })
}
