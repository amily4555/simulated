Mock && Random && (function(sm, Mock, Random){

    Random.extend({
        simulatedModel: function (model) {
            return Mock.mock(sm[model]);
        },

        simulatedResponse: function (model, extendOpt) {
            var response = sm.response(model);
            response = Mock.Util.extend(response, extendOpt || {});
            return  Mock.mock(response);
        },

        simulatedPagination: function(model, extendOpt){
            var pagination = sm.pagination(model);
            pagination = Mock.Util.extend(pagination, extendOpt || {});
            return  Mock.mock(pagination);
        }
    });

})(simulatedModel, Mock, Random);