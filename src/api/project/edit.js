/**
 * @api {post} /v1/project/edit Edit a Project
 * @apiName /v1/project/edit
 * @apiGroup Project
 * @apiPermission none
 *
 * @apiDescription This will edit a project.
 *
 * @apiParam {String}	id	            Project ID which we are trying to edit.
 * @apiParam {String}	[name]	        Project name.
 * @apiParam {Number}	[epochDue]	    Epoch when project will be due.
 * @apiParam {Number}	[epochStarted]	Epoch when project was started.
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
const editProject = require('../../logic/project/edit')

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

        const response = await editProject.edit({
            id,
            name,
            epochDue,
            epochStarted,
        })
        restify.ok(req, res, next, response)
    })
}
