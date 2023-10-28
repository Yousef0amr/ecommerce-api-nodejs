const statusCodes = {
    200: 'OK', 
    201: 'Created', //created
    204: 'No Content', //deleted 
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    410: 'Gone',
    500: 'Internal Server Error',
};

module.exports = statusCodes;