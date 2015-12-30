/**
 * 数据返回模型
 * @type {{}}
 */

/**
 * res: {
 *      data: {
 *          userId: 123,
 *          name: 'Mizi lin',
 *          createUserId: 456
 *      },
 *
 *      user: {
 *          456: {
 *              userId: 456,
 *              name: 'Zhang San'
 *              createUserId: 789
 *          }
 *      }
 * }
 *
 * res: {
 *      data: [{
 *          userId: 123,
 *          createUserId: 456
 *      },{
 *          userId: 456
 *          createUserId: 789
 *      }],
 *
 *      total: 98,
 *      start: 0,
 *      limit: 20,
 *
 *      user: {
 *          456: {
 *              userId: 456,
 *              name: 'Zhang San'
 *              createUserId: 789
 *          },
 *
 *          789: {
 *              userId: 789,
 *              name: 'Li4'
 *              createUserId: 1000
 *          }
 *      }
 *
 * }
 */

var simulatedModel = {

    user: {
        'userId|+1': 1000,
        'name': '@name',
        'age|1-100': 100,
        'color': '@color',
        'newsId|1000-1010': 1000,
        'createUserId|1000-1010': 1000
    },

    news: {
        'newsId|+': 1000,
        'title': '@word'
    },

    // 返回数据的基本类型
    response: function(model){
        return {
            data: '@simulatedModel("'+model+'")'
        }
    },

    // 返回数据为分页（list Map）
    pagination: function(model){
        return {
            'data|1-10': ['@simulatedModel("'+model+'")'],
            'total': function() {
                var total = Math.floor(Math.random() * 100);
                var l = this.data.length;
                return total > l ? total : l;
            },

            'start': function(){
                var rank = Math.floor( Math.random() * 3 );
                return rank * this.limit;
            },

            'limit': 10
        }
    }
};

var simulatedMock = {
    '/v1/users': {
        'GET': '@simulatedPagination("user")',
        'POST': '@simulatedResponse("user")',
        'DELETE': {},

        'primaryKey': 'userId'
    }
};