// 导入gulp
const gulp = require('gulp');
// 导入del
const del = require('del');
// 导入gulp-autoprefixer
const autoprefixer =require('gulp-autoprefixer');
// 导入gulp-cssmin
const cssmin = require('gulp-cssmin');
// 导入gulp-htmlmin
const htmlmin = require('gulp-htmlmin');
// 导入gulp-babel
const babel = require('gulp-babel');
// 导入gulp-uglify
const uglify = require('gulp-uglify');
// 导入gulp-webserver
const webserver = require('gulp-webserver');

// 书写关于css压缩的规则
const cssHandler = ()=>{
    return gulp.src('./src/css/*.css')
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'))
}
// 书写关于html压缩的规则
const htmlHandler = ()=>{
    return gulp.src('./src/pages/*html')
    .pipe(htmlmin({
        collapseWhitespace:true,     //移除所有空格
        minifyJS:true,  //把页面里面script标签里面的js压缩
        minifyCSS:true  //把页面里面的style标签里面的css压缩
    }))
    .pipe(gulp.dest('./dist/pages'))

}
// 书写关于js压缩的规则
const jsHandler = ()=>{
    return gulp.src('./src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
}

// 书写关于lib的移动的规则
const libHandler = ()=>{
    // 我打算把src处理完成以后，都放到dist文件夹下
    return gulp.src('./src/lib/**')
    .pipe(gulp.dest('./dist/lib'))
}
// 书写关于images的移动的规则
const imagesHandler = ()=>{
    return gulp.src('./src/images/**')
    .pipe(gulp.dest('./dist/images'))
}
// 书写关于删除的规则
const delHandler = ()=>{
    return del(['./dist'])
}

// 书写关于webserver的规则
const webserverHandler = ()=>{
    return gulp.src('./dist')   //找到要作为服务器根目录的文件夹
    .pipe(webserver({
        port:8090,//端口号
        open:'./pages/index.html',//你默认打开的首页，路径从dist开始书写
        livereload:true,//热更新,就是当dist里面代码有变化的时候自动刷新浏览器
        proxies:[
            {
                source:'/aaa',
                target:'http://127.0.0.1/housizhou/json.php'
            }

        ]
    }))
}

// 书写自动监控任务
const watchHandler = ()=>{
    gulp.watch('./src/css/*.css',cssHandler)
    gulp.watch('./src/js/*.js',jsHandler);
    gulp.watch('./src/images/**',imagesHandler);
    gulp.watch('./src/pages/*.html',htmlHandler);
    gulp.watch('./src/lib/**',libHandler);

}
// 当我在src里面书写代码的时候，只要我修改我的代码就会被gulp监听到，一旦监听到就帮我删除以前的和压缩现在的，一旦压缩，dist文件里面的内容就变化了
// 变化了以后服务器就会热更新

// 原始的导出一个任务
// module.exports.default = libHandler;
// module.exports.images = imagesHandler;
// module.exports.del = delHandler;
// module.exports.css = cssHandler;
// module.exports.html = htmlHandler;
// module.exports.js =jsHandler;
// 导出的任务可以在命令行运行：gulp 任务名，如果任务名是default可以省略

// 初步优化任务导出
// module.exports.default = gulp.series(
//     delHandler,
//     gulp.parallel(libHandler,imagesHandler,cssHandler,htmlHandler,jsHandler)
// )
// module.exports.server = webserverHandler;

// 最终版优化导出任务
module.exports.default = gulp.series(
    delHandler,
    gulp.parallel(libHandler,imagesHandler,cssHandler,htmlHandler,jsHandler),
    webserverHandler,
    watchHandler
)