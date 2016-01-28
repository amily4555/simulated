var simulatedMockModel = {

    user: {
        'userId|+1': 1000,
        'name': '@name',
        'age|1-100': 100,
        'color': '@color',
        'newsId|1000-1010': 1000,
        'createUserId|1000-1010': 1000
    },

    news: {
        'newsId|+1': 1000,
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
