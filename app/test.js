(function(window, undefined){
    var rd = function(l){
        return Math.floor(Math.random() * (l || 10));
    };

    var rd2 = function(){
        var rds = Math.random().toString().replace('.', '');
        var r1 = rd(15);
        if(r1 >= rds.length){
            r1 = rds.length - 5;
        }

        return parseInt(rds.substr(r1, 1), 10);
    }

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

        var sourcenNames = map(sourceObj, function(count, name){
            return {
                name: name,
                count: count
            }
        }, []).sort(function(a, b){
            return a.count > b.count ? -1 : 1;
        });

        if(names.length < 2){

            var showOrders = map(sourcenNames, function(o){
                return o.name + ':' + o.count;
            }, [])

            console.table(sourcenNames)

            localStorage.setItem('BENAME', parseInt(localStorage.getItem('BENAME', 0),10) + 1 );

            console.debug(parseInt(localStorage.getItem('BENAME', 0),10), names[0] , sourcenNames[0].name, showOrders);

            return names[0] === sourcenNames[0].name ? names[0] : (function(){
                sourceObj = map(sourceObj, function(){
                    return 0;
                }, {});

                return bename_(sourceObj, copy(sourceObj), loop);
            })();
        }

        // 对 sourcenNames 进行随机排序, 打乱顺序
        sourcenNames.sort(function(){
            return Math.random()>.5 ? -1 : 1;
        });

        for(var i = 0; i< loop; i ++){
            var ind = rd2();
            var rd66 = rd(ind*10);
            var name = sourcenNames[ind].name;

            if(nameObj[name] != null){
                nameObj[name] = nameObj[name] + rd66;
            }
            sourceObj[name] = sourceObj[name] + rd66;

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

        // 去除数组最少一项
        sortNames.pop();

        nameObj = map(sortNames, function(o, i){
            return {
                '__key__': o.name,
                '__val__': 0
            }
        }, {});



        return bename_(sourceObj, nameObj, loop);
    };

    window.bename = function(nameObj, loop){
        return bename_(copy(nameObj), nameObj, loop);
    };


})(window);


var nameObj  = {
    '林逸': 0,
    '林尧': 0,
    '林霄': 0,
    '林放': 0,
    '林纾': 0,
    '林恒': 0,
    '林初': 0,
    '林峯': 0,
    '林野': 0,
    '林素': 0
};

do {
    localStorage.setItem('BENAME', 0);

    //var name = bename(nameObj, 121923);
    var name = bename(nameObj, 9999);

    if( localStorage.getItem('BENAME') != 6){
        console.info('米少可能的名字', name);
    }else{
        console.info('米少最终取名', name);
    }

} while( localStorage.getItem('BENAME') != 6 );

//localStorage.setItem('BENAME', 0);
//do {
//    //localStorage.setItem('BENAME', 0);
//
//    var name = bename(nameObj, 121923);
//
//    //if( localStorage.getItem('BENAME') != 6){
//    //    console.info('米少可能的名字', name);
//    //}else{
//    //    console.info('米少最终取名', name);
//    //}
//
//} while( localStorage.getItem('BENAME') != 2306 );

