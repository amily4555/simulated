(function(window, undefined){
    var rd = function(){
        return Math.floor(Math.random() * 10);
    };

    var copy = function(obj){
        var target = {};

        for(var key in obj) if(obj.hasOwnProperty(key)) {
            target[key] = obj[key];
        }

        return target;
    };

    var isArray = Array.isArray;

    var isObject = function(obj) {
        return obj !== null && typeof obj === 'object';
    };

    var forEach = function(obj, fn){
        var rst;
        if(isArray(obj)){
            for(var i = 0, l = obj.length; i<l; i++){
                rst = fn.call(null, obj[i], i);
                if('__BREAK__' === rst){
                    break;
                }
            }
        }else{
            for(var key in obj) if(obj.hasOwnProperty(key)) {
                rst = fn.call(null, obj[key], key);
                if('__BREAK__' === rst){
                    break;
                }
            }
        }
    }

    var map = function(obj, fn, oa){
        var o = oa, rst;

        var isRstArray = isArray(oa);

        forEach(obj, function(val, key){
            rst = fn.call(null, obj[key], key);
            if(isRstArray){
                o.push(rst);
            }else{
                o[rst.__key__ || key] = rst.__val__ == null ? rst : rst.__val__ ;
            }
        })

        return o;
    };

    var bename_ = function(sourceObj, nameObj, loop){

        var names = map(nameObj, function(val, key){
            return key;
        }, []);

        var sourcenNames = map(sourceObj, function(val, key){
            return key;
        }, []);

        if(names.length < 2){
            console.debug(names[0] , sourcenNames[0]);
            return names[0] === sourcenNames[0] ? names[0] : bename_(sourceObj, copy(sourceObj), loop);
        }

        for(var i = 0; i< loop; i ++){
            var ind = rd();
            var name = sourcenNames[ind];

            if(nameObj[name] != null){
                nameObj[name] = nameObj[name] + 1;
            }
            sourceObj[name] = sourceObj[name] + 1;
        }

        var sortNames = map(nameObj, function(count, name){
            return {
                name: name,
                count: count
            }
        }, []).sort(function(a, b){
            return a.count > b.count ? -1 : 1;
        });

        //console.group('排名总数和顺序');
        //
        //console.table(
        //    map( copy(sourceObj), function(v, k){
        //        return {
        //            name: k,
        //            count: v
        //        }
        //    }, []).sort(function(a, b){
        //        return a.count > b.count ? -1 : 1;
        //    })
        //);
        //
        //console.table(sortNames);
        //
        //console.groupEnd();
        //
        //sortNames.pop();
        //
        //nameObj = map(sortNames, function(o, i){
        //    return {
        //        '__key__': o.name,
        //        '__val__': 0
        //    }
        //}, {});



        return bename_(sourceObj, nameObj, loop);
    };

    window.bename = function(nameObj, loop){
        return bename_(copy(nameObj), nameObj, loop);
    };


})(window);
//
//
//var nameObj  = {
//    '林逸': 0,
//    '林尧': 0,
//    '林霄': 0,
//    '林放': 0,
//    '林纾': 0,
//    '林野': 0,
//    '林初': 0,
//    '林峯': 0,
//    '林素': 0,
//    '林恒': 0
//};
//
//console.info('孩子姓名', bename(nameObj, 10));
//
//
//
//
//

console.log(11111);
