
var fs = require('fs');

module.exports = function (grunt) {
    //提取动画库中的配置
    function activateAnimations() {
      var categories = JSON.parse(fs.readFileSync('animate-config.json')),
        category, files, file,
        target = ['src/css/*.css','src/animatecss/_base.css'],
        count = 0;
      for (category in categories) {
        if (categories.hasOwnProperty(category)) {
          files = categories[category];

          for (var i = 0; i < files.length; ++i) {
            if(files[i].split(":")[1] == 1){
              target.push('src/animatecss/' + category + '/' + files[i].split(":")[0]+ '.css');
              count += 1;
            }
          }
        }
      }

      if (!count) {
        console.log('没有动画');
        target = ['src/css/*.css'] ;
      } else {
        console.log(count + (count > 1 ? ' 个动画' : ' 个动画') + ' 被编译');
      }

    return target;
  }

  var basecss = activateAnimations() ;
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //bootstrap自定义less编译成css
    less: {
      compileCore: {
        options: {
          strictMath: true
        },
        src: 'src/bootstrap/less/bootstrap.less',
        dest: 'src/css/mybootstrap.css'
      },

      base:{
        options: {
          strictMath: true,
          //sourceMap: true,
          outputSourceFiles: true,
          // sourceMapURL: 'mybootstrap.css.map',
          // sourceMapFilename: 'dist/css/mybootstrap.css.map'
        },
        src: 'src/css/_base.less',
        dest: 'src/css/_base.css'
      },
      animate:{
        options: {
          strictMath: true,
          //sourceMap: true,
          outputSourceFiles: true,
          // sourceMapURL: 'mybootstrap.css.map',
          // sourceMapFilename: 'dist/css/mybootstrap.css.map'
        },
        src: 'src/animatecss/_base.less',
        dest: 'src/animatecss/_base.css'
      }

    },
    concat: {
      options: {
        separator: '\n'
      },
      myjs: {
        src: 'src/js/*.js',
        dest: 'dist/js/app.js'
      },
      //合并zepto,默认zepto  event  ajax form  ie fx fx_methods  touch这几个模块,想合并更多功能请自行添加
      zepto: {
        src: [
          'src/js/zepto/zepto.js',
          'src/js/zepto/event.js',
          'src/js/zepto/ajax.js',
          'src/js/zepto/form.js',
          'src/js/zepto/ie.js',
          'src/js/zepto/fx.js',
          'src/js/zepto/fx_methods.js',
          // 'src/js/zepto/touch.js',
          'src/js/zepto/selector.js',
          //'src/js/zepto/_tpl.js',//从undescore中提取模板库，很有用。所以合入zepto中
          'src/js/zepto/fastclick.js',//点击延迟
          'src/js/zepto/zepto.cookie.js'//tap事件点击穿透的解决方案
        ],
        dest: 'dist/js/zepto.min.js'
      }
    },
    //压缩js
    uglify: {
         options: {
          compress: {
            drop_console: true
          }
         },
         //压缩zepto
         zepto:{
            src: 'dist/js/zepto.min.js',
            dest: 'dist/js/zepto.min.js'
         }
    },
    //css压缩合并
    cssmin: {
         options:{
            keepSpecialComments: 0
         },
         default:{
            src: basecss,
            dest: 'dist/css/bootable.min.css'
         }
     },
     copy: {
      main: {
        expand: true,
        cwd: './dist/',
        src: ['**'],
        dest: '../server/static'
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less') ;
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 默认任务
  grunt.registerTask('build', ['less:compileCore','less:base','less:animate','cssmin:default']);

}