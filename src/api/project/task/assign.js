/**
 * @api {post} /v1/project/task/assign Assign a Task to a Project
 * @apiName /v1/project/task/assign
 * @apiGroup Project
 * @apiPermission none
 *
 * @apiDescription This will assign a task to a project.
 *
 * @apiParam {String}	projectId	        Project ID which we are trying to assign the task to.
 * @apiParam {String}	taskId	            Task ID which we are trying to assign the project to.
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
const app = require('../../../app')
const restify = require('../../../helpers/restifyHelpers')
const editProject = require('../../../logic/project/edit')

module.exports = async (url) => {
    app.post(url, async (req, res, next) => {
        const taskId = restify.getAsStringAlphanumeric(
            req,
            'taskId',
            '',
            true,
            50
        )
        const projectId = restify.getAsStringAlphanumeric(
            req,
            'projectId',
            '',
            true,
            50
        )

        const response = await editProject.assignTaskToProject({
            taskId,
            projectId,
        })
        restify.ok(req, res, next, response)
    })
}
