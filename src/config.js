module.exports = {
    mongodb: {
        url: 'mongodb://127.0.0.1:27017',
        name: 'todoList',
        collections: {
            tasks: {
                name: 'tasks',
                allowedStatuses: {
                    created: 'CREATED',
                    inProgress: 'IN_PROGRESS',
                    done: 'DONE',
                    overdue: 'OVERDUE',
                },
                sortByFields: ['epochStarted', 'epochDue', 'epochDone'],
            },
            projects: {
                name: 'projects',
                allowedStatuses: {
                    created: 'CREATED',
                    inProgress: 'IN_PROGRESS',
                    done: 'DONE',
                    overdue: 'OVERDUE',
                },
                sortByFields: ['epochStarted', 'epochDue'],
            },
        },
    },
}
