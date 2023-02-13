/**
 * @api {post} /v1/project/create Create a Project
 * @apiName /v1/project/create
 * @apiGroup Project
 * @apiPermission none
 *
 * @apiDescription This will create a project.
 *
 * @apiParam {String}	name	        Project name.
 * @apiParam {Number}	epochDue	    Epoch when project will be due.
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
const createProject = require('../../logic/project/create')

module.exports = async (url) => {
    app.post(url, async (req, res, next) => {
        const name = restify.getAsStringAlphanumeric(req, 'name', '', true, 255)
        const epochDue = restify.getAsNumber(req, 'epochDue', '', true)

        const response = await createProject.create({ name, epochDue })
        restify.ok(req, res, next, response)
    })
}
