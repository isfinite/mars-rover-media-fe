module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		, imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				}
				, files: [
					{
						expand: true
						, cwd: 'assets/images'
						, src: ['**/*.png']
						, dest: 'public/images/compressed'
						, ext: '.png'
					}
				]
			}
			, jpg: {
				options: {
					progressive: true
				}
				, files: [
					{
						expand: true
						, cwd: 'assets/images'
						, src: ['**/*.jpg']
						, dest: 'public/images/compressed'
						, ext: '.jpg'
					}
				]
			}
		}
		, concat: {
			css: {
				src: ['assets/css/*.css']
				, dest: 'assets/build/css/aggregated.css'
			}
			, js: {
				src: [
					'assets/js/angular.min.js'
					, 'assets/js/angular-slider.min.js'
					, 'assets/js/d3.min.js'
					, 'assets/js/c3.min.js'
				]
				, dest: 'assets/build/js/aggregated.min.js'
			}
		}
		, uglify: {
			options: {
				mangle: true
				, compress: true
				, report: false
				, banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			}
			, build: {
				src: 'assets/js/core.js'
				, dest: 'assets/js/core.min.js'
			}
		}
		, less: {
			development: {
				options: {
					compress: true
					, yuicompress: true
					, optimization: 2
				}
				, files: {
					'assets/css/screen.css': 'assets/css/screen.less'
				}
			}
		}
		, watch: {
			files: ['assets/css/*', 'assets/js/*']
			, tasks: ['less', 'uglify', 'concat', 'imagemin']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerTask('default', ['watch']);

}