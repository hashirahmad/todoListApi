const moment = require('moment')
const config = require('../../config')
const mongo = require('../../database/mongo')
const APIError = require('../../helpers/APIError')

class createTask {
    constructor() {
        this.allowedStatuses = config.mongodb.collections.tasks.allowedStatuses
        this.collection = config.mongodb.collections.tasks.name
    }

    /**
     * Creates a task with the given `name` and when its due.
     */
    async create({ name, epochDue }) {
        const { collection, allowedStatuses } = this
        const now = moment()

        if (moment.unix(epochDue).isBefore(now)) {
            throw new APIError({
                errorCode: 'INVALID_PARAM',
                templateUserMessage: `Due date cannot be in the past i.e. before ${now.format(
                    'LLLL'
                )}`,
            })
        }

        const doc = {
            name,
            epochDue,
            status: allowedStatuses.created,
            epochCreated: now.unix(),
            epochStarted: 0,
            epochDone: 0,
        }
        const response = await mongo.insertOne({ doc, collection })
        return { created: response.inserted, id: response.id }
    }
}

module.exports = new createTask()
