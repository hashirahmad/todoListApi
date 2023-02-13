const { ObjectId, MongoClient: mongodb } = require('mongodb')

const log = require('../helpers/log')
const APIError = require('../helpers/APIError')
const config = require('../config')

/**
 * The idea is that to export an instance
 * of this class Mongo across the entire
 * app - this way we have one connection
 * and that connection is kept alive.
 */
class Mongo {
    constructor() {
        this.db = null
        this.objectId = ObjectId
        this.name = config.mongodb.name
        this.collections = Object.keys(config.mongodb.collections)
        this.collectionsCreated = false
    }

    /**
     * This should be invoked at an entry point.
     * Preferably in app.js
     */
    async connect(isTest = false) {
        if (this.db === null) {
            try {
                const client = await mongodb
                    .connect(config.mongodb.url, {
                        useUnifiedTopology: true,
                        useNewUrlParser: true,
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                if (isTest === false) {
                    console.log(`'${this.name}' database connected!`)
                }
                if (!client) return
                this.db = client.db(config.mongodb.name)
            } catch (err) {
                log.notify(
                    true,
                    {
                        err,
                        info: [
                            'This is related to mongodb connect() function',
                        ].join(' '),
                    },
                    err.message,
                    err.name,
                    err.code
                )
            }
        }
    }

    /**
     * It is supposed to be called by `app.js` as one off process to make
     * sure that database is connected and the collections are created if not
     * already created.
     */
    async onServerStartUp() {
        await this.connect()
        await this.createCollectionsIfNotAlready()
    }

    /**
     * It gets the database instance with the `ok` property
     * indicating that `db` is in affirmative and shortcuts
     * for the collections.
     */
    getInstance() {
        const ok = this.db !== null && this.collectionsCreated
        if (!ok) return { ok: false }
        return {
            ok: true,
            db: this.db,
            tasks: this.db.collection('tasks'),
            projects: this.db.collection('projects'),
        }
    }

    /**
     * A utility function to allow simple insertion and reporting to
     * keybase when particular `doc` could not be inserted for better
     * understanding as to why it failed.
     */
    async insertOne({ doc, collection }) {
        this.earlyExitIfNotAllWell()
        const response = await this.db.collection(collection).insertOne(doc)
        if (!response.acknowledged) {
            log.notify(
                true,
                { doc, collection, response },
                'Insert document not inserted. Have a look at the data.'
            )
        }
        return { inserted: response.acknowledged, id: response.insertedId }
    }

    /**
     * A utility function to find a document by the given `id` for
     * any given `collection`.
     */
    async findById({ id, collection }) {
        this.earlyExitIfNotAllWell()
        const response = await this.db
            .collection(collection)
            .findOne(this.byId(id))
        return { doc: response, ok: response !== null }
    }

    /**
     * A utility function to allow updating of the document by
     * given `id` for any given `collection` and what fields should
     * be updated. It will also alert us on keybase when somehow
     * some ID ends up updating more than 1 document.
     */
    async updatedById({ collection, id, partialDoc }) {
        this.earlyExitIfNotAllWell()
        const response = await this.db
            .collection(collection)
            .updateOne(this.byId(id), { $set: partialDoc })
        if (response.acknowledged && response.matchedCount > 1) {
            log.notify(
                true,
                { response, partialDoc, id, collection },
                'Somehow with the given ID, there was more than one document updated!'
            )
        }
        return { ok: response.acknowledged }
    }

    /**
     * A utility function to allow deleting a given document
     * by its `id` for a given `collection`.
     */
    async deleteById({ id, collection }) {
        this.earlyExitIfNotAllWell()
        const response = await this.db
            .collection(collection)
            .deleteOne(this.byId(id))
        if (response.acknowledged && response.deletedCount > 1) {
            log.notify(
                true,
                { response, id, collection },
                'Somehow with the given ID, there was more than one document deleted!'
            )
        }
        return { ok: response.acknowledged }
    }

    removeUndefinedProps(obj) {
        const newObj = {}
        Object.keys(obj).forEach((key) => {
            if (obj[key] === Object(obj[key]))
                newObj[key] = this.removeUndefinedProps(obj[key])
            else if (obj[key] !== undefined) newObj[key] = obj[key]
        })
        return newObj
    }

    /**
     * This is a utility function to make sure that before we start
     * interacting with the database client, that the database client
     * is indeed ready for interaction. When not ready it will simply
     * throw an API error simply for the sake of graceful response.
     */
    earlyExitIfNotAllWell() {
        const instance = this.getInstance()
        if (!instance.ok) {
            throw new APIError({
                errorCode: 'DATABASE_MAINTENANCE_DUE',
                templateUserMessage:
                    'The system database needs due maintenance. Try again momentarily',
            })
        }
    }

    /**
     * It will create collections if not already created. This function
     * will throw an error if the database was not connected.
     */
    async createCollectionsIfNotAlready() {
        if (this.db === null) {
            throw new Error(`'${this.name}' cannot be connected!`)
        }
        const existingCollections = await this.db.listCollections().toArray()
        for (let i = 0; i < this.collections.length; i += 1) {
            const collection = this.collections[i]
            const exits = existingCollections.some((o) => o.name === collection)
            if (!exits) {
                // eslint-disable-next-line no-await-in-loop
                await this.db.createCollection(collection)
                console.log(`'${this.name}.${collection}' collection created.`)
            }
        }
        this.collectionsCreated = true
    }

    /**
     * It is wrapper to easily just pass an ID
     * and it will return the object that needs
     * to be passed in to `find` functions.
     * It also verifies that `id` is actually
     * valid ID.
     */
    // eslint-disable-next-line class-methods-use-this
    byId(id) {
        /**
         * `ObjectId` expects 12 bytes string or
         * 24 character hex. So lets make sure it is
         * valid
         */
        if (!ObjectId.isValid(id)) {
            throw new APIError({
                errorCode: 'INVALID_PARAMS',
                objectDetails: {
                    id,
                },
                templateUserMessage: [
                    'This ID is not valid one.',
                    'Must be 12 bytes of String or 24 character hex',
                ].join(' '),
            })
        }

        return { _id: new ObjectId(id) }
    }
}

module.exports = new Mongo()
