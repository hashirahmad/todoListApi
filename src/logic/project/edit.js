const moment = require('moment')
const config = require('../../config')
const mongo = require('../../database/mongo')
const APIError = require('../../helpers/APIError')
const assertDatesAreInTheOrder = require('../assertDatesAreInTheOrder')
const editTask = require('../task/edit')

class editProject {
    constructor() {
        this.allowedStatuses =
            config.mongodb.collections.projects.allowedStatuses
        this.collection = config.mongodb.collections.projects.name
    }

    /**
     * It will get the project by its `id` and equally assert if
     * no project is found by the `id`.
     */
    async getProjectAndAssertItExists({ id }) {
        const { doc, ok } = await mongo.findById({
            id,
            collection: this.collection,
        })
        if (!ok) {
            throw new APIError({
                errorCode: 'INVALID_PARAM',
                templateUserMessage: `No project by the provided id '${id}'`,
            })
        }
        return doc
    }

    /**
     * Will get `status` according to the due/started/done dates
     */
    getStatus({ epochDue, epochStarted, epochDone }) {
        const due = moment.unix(epochDue)
        const done = moment.unix(epochDone)

        const dueDateIsBeforeDoneDate = due.isBefore(done)
        const dueDateIsAfterDoneDate = epochDone && due.isAfter(done)

        if (dueDateIsBeforeDoneDate) return this.allowedStatuses.done
        if (dueDateIsAfterDoneDate) return this.allowedStatuses.overdue
        if (epochStarted) return this.allowedStatuses.inProgress
        return undefined
    }

    /**
     * Assign a given task by its `id` to a given project by its `id`.
     */
    async assignTaskToProject({ taskId, projectId }) {
        await editTask.getTaskAndAssertItExists({ id: taskId })
        const response = await this.edit({ id: projectId, taskId })
        return { assigned: response.edited, taskId }
    }

    /**
     * Mark a particular project as done by the project `id`. It will
     * also mark all the tasks as done too.
     */
    async done({ id }) {
        const project = await this.getProjectAndAssertItExists({ id })
        const associatedTasks = project.taskIds
        const taskIdsOfTasksDone = []
        for (let i = 0; i < associatedTasks.length; i += 1) {
            const taskId = associatedTasks[i]
            // eslint-disable-next-line no-await-in-loop
            await editTask.done({ id: taskId })
            taskIdsOfTasksDone.push(taskId)
        }
        const response = await this.edit({
            id,
            epochDone: moment().unix(),
        })
        return {
            edited: response.edited,
            tasksDone: taskIdsOfTasksDone.length === associatedTasks.length,
            taskIds: taskIdsOfTasksDone,
        }
    }

    /**
     * Deletes a particular project by the project `id`. It will also
     * delete all the associated tasks too.
     */
    async delete({ id }) {
        const project = await this.getProjectAndAssertItExists({ id })
        const associatedTasks = project.taskIds
        const taskIdsOfTasksDeleted = []
        for (let i = 0; i < associatedTasks.length; i += 1) {
            const taskId = associatedTasks[i]
            // eslint-disable-next-line no-await-in-loop
            await editTask.delete({ id: taskId })
            taskIdsOfTasksDeleted.push(taskId)
        }
        const response = await mongo.deleteById({
            id,
            collection: this.collection,
        })
        return {
            deleted: response.ok,
            tasksDone: taskIdsOfTasksDeleted.length === associatedTasks.length,
            taskIds: taskIdsOfTasksDeleted,
        }
    }

    /**
     * Edits a project with the given project ID and allows editing
     * fields such as start/done time and name
     */
    async edit({ id, name, epochDue, epochStarted, epochDone, taskId }) {
        const doc = await this.getProjectAndAssertItExists({ id })
        assertDatesAreInTheOrder({
            epochDue: epochDue || doc.epochDue,
            epochDone: epochDone || doc.epochDone,
            epochStarted: epochStarted || doc.epochStarted,
            epochCreated: doc.epochCreated,
        })
        const taskIds = Array.from(doc.taskIds)
        if (taskId) taskIds.push(taskId)
        const partialDoc = mongo.removeUndefinedProps({
            name: name || undefined,
            epochDue: epochDue || undefined,
            status: this.getStatus({
                epochDue: epochDue || doc.epochDue,
                epochDone: epochDone || doc.epochDone,
                epochStarted: epochStarted || doc.epochStarted,
            }),
            epochStarted: epochStarted || undefined,
            epochDone: epochDone || undefined,
            taskIds: taskId ? taskIds : undefined,
        })
        const response = await mongo.updatedById({
            collection: this.collection,
            id,
            partialDoc,
        })
        return { edited: response.ok }
    }
}

module.exports = new editProject()
