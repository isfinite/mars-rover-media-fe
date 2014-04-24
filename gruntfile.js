module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		, concat: {
			css: {
				src: ['assets/css/screen.css']
				, dest: 'assets/build/css/aggregated.css'
			}
		}
		, uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			}
			, build: {
				src: 'src/<%= pkg.name %>.js'
				, dest: 'build/<%= pkg.name %>.min.js'
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
			files: 'assets/css/*'
			, tasks: ['less', 'concat']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['watch']);

}