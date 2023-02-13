/** ALL APIs */

/** Task APIs */
require('./api/task/create')('/v1/task/create')
require('./api/task/list')('/v1/task/list')
require('./api/task/done')('/v1/task/done')
require('./api/task/edit')('/v1/task/edit')
require('./api/task/delete')('/v1/task/delete')

/** Project APIs */
require('./api/project/create')('/v1/project/create')
require('./api/project/task/assign')('/v1/project/task/assign')
require('./api/project/list')('/v1/project/list')
require('./api/project/done')('/v1/project/done')
require('./api/project/edit')('/v1/project/edit')
require('./api/project/delete')('/v1/project/delete')
