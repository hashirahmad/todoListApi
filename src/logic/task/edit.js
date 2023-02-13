const moment = require('moment')
const config = require('../../config')
const mongo = require('../../database/mongo')
const APIError = require('../../helpers/APIError')
const assertDatesAreInTheOrder = require('../assertDatesAreInTheOrder')

class editTask {
    constructor() {
        this.allowedStatuses = config.mongodb.collections.tasks.allowedStatuses
        this.collection = config.mongodb.collections.tasks.name
    }

    /**
     * It will get the task by its `id` and equally assert if
     * no task is found by the `id`.
     */
    async getTaskAndAssertItExists({ id }) {
        const { doc, ok } = await mongo.findById({
            id,
            collection: this.collection,
        })
        if (!ok) {
            throw new APIError({
                errorCode: 'INVALID_PARAM',
                templateUserMessage: `No task by the provided id '${id}'`,
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
     * Mark a particular task as done by the task `id`.
     */
    async done({ id }) {
        const response = await this.edit({
            id,
            epochDone: moment().unix(),
        })
        return response
    }

    /**
     * Deletes a particular task by the task `id`.
     */
    async delete({ id }) {
        const response = await mongo.deleteById({
            id,
            collection: this.collection,
        })
        return { deleted: response.ok }
    }

    /**
     * Edits a task with the given task ID and allows editing
     * fields such as start/done time and name
     */
    async edit({ id, name, epochDue, epochStarted, epochDone }) {
        const doc = await this.getTaskAndAssertItExists({ id })
        assertDatesAreInTheOrder({
            epochDue: epochDue || doc.epochDue,
            epochDone: epochDone || doc.epochDone,
            epochStarted: epochStarted || doc.epochStarted,
            epochCreated: doc.epochCreated,
        })
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
        })
        const response = await mongo.updatedById({
            collection: this.collection,
            id,
            partialDoc,
        })
        return { edited: response.ok }
    }
}

module.exports = new editTask()
