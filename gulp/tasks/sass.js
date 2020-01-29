'use strict';

var autoprefixer = require('autoprefixer');
var animation = require('postcss-animation');
var flexbugsFixes = require('postcss-flexbugs-fixes');
var autoprefixerConfig = ['last 10 versions', '> 5%', 'ie 8'];
var postcssConfig = [
	autoprefixer(autoprefixerConfig),
	animation(),
	flexbugsFixes(),
];

//шаблонизатор sass
module.exports = function () {
	$.gulp.task('sass:dev', function(){
		return $.gulp.src([
			'dev/static/sass/*.sass',
			])//от куда
			.on("error", $.plugin.notify.onError(function (error) {//обработчик ошибок
				return {
					title: 'Sass',
					message: error.message
				};
			}))
			.pipe($.plugin.sourcemaps.init())//Инициализируем sourcemap, помогает при отладке кода
			.pipe($.plugin.sass({
				includePaths: ['node_modules']
			}))
			.pipe($.plugin.postcss(postcssConfig))
			.pipe($.plugin.sourcemaps.write())//Пропишем карты
			.pipe($.gulp.dest('./build/static/css/'))//куда
			.pipe($.browserSync.reload({
                stream: true
            }));
	});
	
	$.gulp.task('sass:build', function(){
		return $.gulp.src([
			'dev/static/sass/*.sass',
			])//от куда
			.pipe($.plugin.sass())
			.pipe($.plugin.postcss(postcssConfig))
			.pipe($.plugin.csscomb())
			.pipe($.plugin.csso())//minify css, объединение правил для селекторов
			.pipe($.gulp.dest('./build/static/css/'))//куда
	});
};
