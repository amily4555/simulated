var simulatedStore = {

    user: {
        data: {
            'name': '@name()',
            'age|1-100': 100,
            'color': '@color'
        }
    }
};



var mockData = {
    '/v1/users': {
        'GET': {
            'data|1-10': [{
                'id|+1': 1,
                'name': '@name()',
                'age|1-100': 100,
                'color': '@color'
            }],

            'total': 10,
            'start': 0,
            'limit': 10
        },

        'POST': {
            'id': 1,
            'name': '@name()',
            'age|1-100': 100,
            'color': '@color'
        },

        'DELETE': {

        }

    }
};