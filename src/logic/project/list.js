const moment = require('moment')
const config = require('../../config')
const mongo = require('../../database/mongo')
const APIError = require('../../helpers/APIError')

class listProject {
    constructor() {
        this.allowedStatuses = Object.values(
            config.mongodb.collections.projects.allowedStatuses
        )
        this.allowedSortByFields =
            config.mongodb.collections.projects.sortByFields
    }

    /**
     * Add types so we know what the types are and maintains
     * single source of truth.
     */
    // eslint-disable-next-line class-methods-use-this
    parse(array) {
        const parsed = Array.from(array).map((o) => ({
            // eslint-disable-next-line no-underscore-dangle
            id: String(o._id),
            name: String(o.name),
            status: String(o.status),
            epochDue: Number(o.epochDue),
            epochDone: Number(o.epochDone),
            epochStarted: Number(o.epochStarted),
            epochCreated: Number(o.epochCreated),
            taskIds: o.taskIds,
            due: moment
                .unix(o.epochDue)
                .format('LLLL')
                .replace('Thursday, January 1, 1970 1:00 AM', 'never'),
            created: moment
                .unix(o.epochCreated)
                .format('LLLL')
                .replace('Thursday, January 1, 1970 1:00 AM', 'never'),
            started: moment
                .unix(o.epochStarted)
                .format('LLLL')
                .replace('Thursday, January 1, 1970 1:00 AM', 'never'),
            done: moment
                .unix(o.epochDone)
                .format('LLLL')
                .replace('Thursday, January 1, 1970 1:00 AM', 'never'),
        }))
        return parsed
    }

    /**
     * Makes sure that when filtering by `status`, that status
     * is indeed one of the allowed statuses.
     */
    assertStatusIsValid({ status }) {
        if (!this.allowedStatuses.includes(status)) {
            throw new APIError({
                errorCode: 'INVALID_PARAM',
                templateUserMessage: `Invalid status, must be one of: ${this.allowedStatuses.join(
                    ','
                )}`,
            })
        }
    }

    /**
     * Makes sure that when sorting by a field, that status
     * is indeed one of the allowed statuses.
     */
    assertSortFieldIsValid({ sortBy }) {
        if (!this.allowedSortByFields.includes(sortBy)) {
            throw new APIError({
                errorCode: 'INVALID_PARAM',
                templateUserMessage: `Invalid sort by, must be one of: ${this.allowedSortByFields.join(
                    ','
                )}`,
            })
        }
    }

    /**
     * Lists all projects and potentially filter down by `name`
     * and `status`. Can also sort by `epochDue`/`epochStart`/`epochDone`
     * dates in the ascending/descending order.
     */
    async list({ name, status, sortBy, ascending }) {
        mongo.earlyExitIfNotAllWell()
        const { projects } = mongo.getInstance()
        const options = {}
        const sort = {}
        let response
        if (name) {
            options.name = { $regex: new RegExp(name) }
        }
        if (status) {
            this.assertStatusIsValid({ status })
            options.status = { $regex: new RegExp(status) }
        }
        if (sortBy) {
            this.assertSortFieldIsValid({ sortBy })
            sort[sortBy] = ascending ? 1 : -1
            response = await projects.find(options).sort(sort).toArray()
        } else response = await projects.find(options).toArray()
        const parsed = this.parse(response)
        return parsed
    }
}

module.exports = new listProject()
