const moment = require('moment')
const APIError = require('../helpers/APIError')

module.exports = function ({
    epochDue,
    epochStarted,
    epochDone,
    epochCreated,
}) {
    const due = moment.unix(epochDue)
    const started = moment.unix(epochStarted)
    const done = moment.unix(epochDone)
    const created = moment.unix(epochCreated)
    const now = moment()

    if (
        epochDue &&
        epochDone &&
        epochStarted &&
        (done.isBefore(due) || started.isBefore(due))
    ) {
        throw new APIError({
            errorCode: 'INVALID_PARAM',
            templateUserMessage: `Due date (${due.format(
                'LLLL'
            )}) cannot be before done date (${done.format(
                'LLLL'
            )}) or start date (${started.format('LLLL')})`,
        })
    }
    if (
        epochDue &&
        epochDone &&
        epochStarted &&
        (done.isAfter(started) || due.isAfter(started))
    ) {
        throw new APIError({
            errorCode: 'INVALID_PARAM',
            templateUserMessage: `Start date (${started.format(
                'LLLL'
            )}) cannot be after done date (${done.format(
                'LLLL'
            )}) or due date (${due.format('LLLL')})`,
        })
    }
    if (epochDue && due.isBefore(created)) {
        throw new APIError({
            errorCode: 'INVALID_PARAM',
            templateUserMessage: `Due date (${due.format(
                'LLLL'
            )}) cannot be before the task created date (${created.format(
                'LLLL'
            )})`,
        })
    }
    if (epochStarted && now.isBefore(started)) {
        throw new APIError({
            errorCode: 'INVALID_PARAM',
            templateUserMessage: `Start date cannot be in the future i.e. after (${now.format(
                'LLLL'
            )})`,
        })
    }
    if (epochDone && started.isBefore(done)) {
        throw new APIError({
            errorCode: 'INVALID_PARAM',
            templateUserMessage: `Done date cannot be before start date (${started.format(
                'LLLL'
            )})`,
        })
    }
}
