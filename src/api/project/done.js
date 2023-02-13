/**
 * @api {post} /v1/project/done Mark a Project as Done
 * @apiName /v1/project/done
 * @apiGroup Project
 * @apiPermission none
 *
 * @apiDescription This will mark a project as done.
 *
 * @apiParam {String}	id	            Project ID which we are trying to mark as done.
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

        const response = await editProject.done({ id })
        restify.ok(req, res, next, response)
    })
}
