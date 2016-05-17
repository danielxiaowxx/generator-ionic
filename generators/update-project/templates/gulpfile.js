var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sh = require('shelljs');
var processhtml = require('gulp-processhtml');
var del = require('del');
var replace = require('gulp-replace');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


//============= 发布 ============= //

gulp.task('release', ['version'], function() {

  // 样式
  gulp.src('./www/css/*.min.css')
    .pipe(gulp.dest('./release/www/css/'));

  // 图片
  gulp.src('./www/img/*.*')
    .pipe(gulp.dest('./release/www/img/'));

  // font
  gulp.src('./www/lib/ionic/fonts/*.*')
    .pipe(gulp.dest('./release/www/lib/ionic/fonts'));

  // 脚本
  gulp.src([
    './www/lib/jquery/dist/jquery.min.js',
    './www/lib/lodash/lodash.min.js',
    './www/lib/ionic/js/ionic.bundle.min.js',
    './www/lib/angular-local-storage/dist/angular-local-storage.min.js',
    './www/lib/angular-md5/angular-md5.min.js',
    './www/lib/ngCordova/dist/ng-cordova.min.js',
    './www/lib/talkingdata/sdk.min.js',
    './www/lib/stacktrace/dist/stacktrace.min.js',
    './www/lib/ionic-scroll-sista/dist/ionic.scroll.sista.min.js',
    './www/lib/ion-image-lazy-load/ionic-image-lazy-load.js'
  ])
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest('./release/www/js/'));
  gulp.src('./www/js/data/*.js')
    .pipe(concat('data.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./release/www/js/'));
  gulp.src('./www/js/controllers/*.js')
    .pipe(concat('controller.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./release/www/js/'));
  gulp.src('./www/js/i18n/*.js')
    .pipe(concat('i18n.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./release/www/js/'));
  gulp.src('./www/js/services/*.js')
    .pipe(concat('service.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./release/www/js/'));
  gulp.src('./www/js/directive.js')
    .pipe(concat('directive.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./release/www/js/'));
  gulp.src('./www/js/filter.js')
    .pipe(concat('filter.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./release/www/js/'));
  gulp.src('./www/js/app.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./release/www/js/'));

  // html
  gulp.src('./www/index.html')
    .pipe(replace('EA77537D220B6526248515426AF68F27', 'AD0D639ED70F39421BF97CDF0F41E003')) // TODO 换测试的talkingdata的appkey替换成正式环境
    .pipe(processhtml())
    .pipe(gulp.dest('./release/www/'));
  gulp.src('./www/templates/*.html')
    .pipe(processhtml())
    .pipe(gulp.dest('./release/www/templates'));

});

// 替换版本号
gulp.task('version', function() {
  var version = require('./package.json').version;

  // 替换config.xml上的版本号
  gulp.src('./config.xml')
    .pipe(replace(/version=\"\d+\.\d+\.\d+\"/, 'version="' + version + '"'))
    .pipe(gulp.dest('./'));

  // TODO 替换setting-about.html的版本号显示
  gulp.src('./www/templates/setting-about.html')
    .pipe(replace(/\d+\.\d+\.\d+/, version))
    .pipe(gulp.dest('./www/templates/'));

  // TODO 替换app.js的版本号常量
  gulp.src('./www/js/app.js')
    .pipe(replace(/\d+\.\d+\.\d+/, version))
    .pipe(gulp.dest('./www/js/'));

});

gulp.task('clean', function(cb) {
  del('./release', cb);
});
