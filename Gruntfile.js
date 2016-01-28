

//expand：如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
//cwd：需要处理的文件（input）所在的目录。
//src：表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
//dest：表示处理后的文件名或所在目录。
//ext：表示处理后的文件后缀名。

//*：匹配任意数量的字符，不包括/。
//?：匹配单个字符，不包括/。
//**：匹配任意数量的字符，包括/。
//{}：允许使用逗号分隔的列表，表示“or”（或）关系。
//!：用于模式的开头，表示只返回不匹配的情况。

module.exports = function (grunt) {
    'use strict';

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        config: appConfig,

//        bower: {
//            install: {
//                options: {
//                    targetDir: '<%= config.app %>/lib',
//                    install: true,
//                }
//            }
//        },

        //监控页面改变
        watch: {
            options: {
                livereload: true
            },

            bower: {
                files: ['bower.json']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['jshint']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,**/}*.html',
                    '<%= config.app %>/{,**/}*.js',
                    '<%= config.app %>/{,**/}*.css'
                ]
            },
            simple: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,**/}*.css'
                ]
            },
            html: {
                files: [
                    '<%= config.app %>/{,*/}*.html'
                ]
            }
        },

        connect: {
            options: {
                port: 9091,
                // Change this to '0.0.0.0' to access the server from outside.
                //hostname: 'dev.tagace.com',
                hostname: 'localhost',
                livereload: 35731,
                base: 'app'
            },
            livereload: {
                //options: {
                //    open: {
                //        target: 'http://dev.tagace.com/crm/index.html'
                //    }
                //}
            }
        },

        // build前清空文件夹
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= config.dist %>/*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // 代码风格检测
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js'
            ]
        },

        // 编译sass文件
        sass: {
            server: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/styles',
                        src: ['*.scss'],
                        dest: '<%= config.app %>/styles',
                        ext: '.css'
                    }
                ]
            }
        },

        // 给CSS3属性添加前缀插件
        autoprefixer: {
            build: {
                expand: true,
                cwd: '.tmp/concat/styles/',
                src: '{,*/}*.css',
                dest: '.tmp/concat/styles/'
            }
        },

        // 复制文件/文件夹 从 app -> dist
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'views/{,*/}*.html',
                        'config/{,*/}*.js',
                        'resources/{,*/}*.json'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>/assets/global/plugins/font-awesome/fonts/',
                    dest: '<%= config.dist %>/fonts/',
                    src: [
                        '*'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>/assets/global/plugins/simple-line-icons/fonts/',
                    dest: '<%= config.dist %>/styles/fonts/',
                    src: [
                        '*'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>/assets/global/img/',
                    dest: '<%= config.dist %>/img/',
                    src: [
                        '*'
                    ]
                }]
            }
        },

        // html 上设置 合并 js，css 代码
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: ['<%= config.app %>/index.html', '<%= config.app %>/default.html']
        },

        // 跟随 useminPrepare 配置
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

        // angular
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts/',
                    src: '*.js',
                    dest: '.tmp/concat/scripts/'
                }]
            }
        },

        // 修改文件名
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/images/{,*/}*.*',
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css'
                    ]
                }
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/images',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: '<%= config.dist %>/images'
                    }
                ]
            }
        },

        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= config.dist %>/images'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: '{,*/}*.html',
                        dest: '<%= config.dist %>'
                    }
                ]
            }
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        },

        // 并行运行任务
        concurrent: {
            dist: [
                'imagemin',
                'svgmin'
            ]
        },


        mock: {
            your_target: {
                options: {
                    // 在这里可以定义一些全局的选项
                    // 比如网络延时，全局的 cookie 和 statusCode
                    delay: 200, // 定义所有路由的延时为 200ms，可以在具体的路由中覆盖该定义
                    cookie: {}, // 定义全局的 cookie
                    port: 8012,
                    // 定义路由规则
                    route: {
                        // API 的路径
                        '/abc': {
                            // GET 请求
                            'get': {
                                // 定义该 API 的 get 请求延时 500ms，覆盖全局中的定义
                                delay: 500,
                                // 这里定义的 cookie 将与全局 cookie 进行合并，返回合并后的 cookie
                                cookie: {
                                    // cookie 键值
                                    id: 123,
                                    username: 'bubkoo',
                                    // cookie 选项，该选项将应用于以上的 cookie
                                    options:{
                                        // cookie 的有效期，这里是一小时
                                        maxAge: 1000 * 60 * 60
                                    }
                                },
                                // 返回的数据
                                data: {
                                    code: 200,
                                    username: 'bubkoo',
                                    email: 'bubkoo@163.com'
                                }
                            },

                            // POST 请求
                            'post': {
                                // 对于该路由的 post 请求，采用全局选项中的设置

                                // 在 data 中使用数据模板
                                data:{
                                    'count|100': 100,
                                    'pageIndex|0-10': 100,
                                    'items|0-30': [
                                        {
                                            'username': '@name',
                                            'email': '@email',
                                            'gender': '@bool',
                                            'age|18-99': 100
                                        }
                                    ]
                                }
                            },

                            // DELETE 请求
                            'delete': {
                                // 这里定义 statusCode 为 403，访问该路由时直接返回 403 状态码
                                statusCode: 403
                            }
                            // 其他未定义的谓词都将返回 404
                        }

                        // 其他未定义的路由都将返回 404
                    }
                }
            }
        }
    });

    grunt.registerTask('bower', ['bower']);
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('mizi', [
        'clean:server',
        'connect:livereload',
        'watch:livereload'
    ]);
    grunt.registerTask('clish', [
        'clean:server',
        'watch:sass',
        'connect:livereload',
        'watch:livereload'
    ]);

    grunt.registerTask('simple', [
        'clean:server',
        'connect:livereload',
        'watch:simple'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'useminPrepare',
        //'sass',

        'concurrent',
        'concat',
        'ngmin',
        'copy',
        'autoprefixer',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin',
        'clean:server'

    ]);
};