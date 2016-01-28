var simulatedMockData = {
    '/v1/users': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    },

    '/v1/users:userId': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    },

    '/v1/users:type': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    },

    '/v1/company/:companyId': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    },

    '/v1/companys/:companyId/records/:recordId': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    },

    '/v1/company/:companyId/scale/:scale': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    },

    '/v1/company/:groupId': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    }
};