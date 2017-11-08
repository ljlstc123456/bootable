
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
    //css压缩合并
    cssmin: {
         options:{
            keepSpecialComments: 0
         },
         default:{
            src: basecss,
            dest: 'dist/css/bootable.min.css'
         }
     }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less') ;

  // 默认任务
  grunt.registerTask('build', ['less:compileCore','less:base','less:animate','cssmin:default']);

}