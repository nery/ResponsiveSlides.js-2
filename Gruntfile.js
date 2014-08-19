module.exports = function(grunt) {
'use strict';
	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON('responsiveSlides.jquery.json'),

		// Banner definitions
		meta: {
			banner: '/*\n' +
				' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
				' *  <%= pkg.description %>\n' +
				' *  <%= pkg.homepage %>\n' +
				' *\n' +
				' *  Made by <%= pkg.author.name %>\n' +
				' *  Under <%= pkg.licenses[0].type %> License\n' +
				' */\n'
		},

		// Concat definitions
		concat: {
			dist: {
				src: ['src/jquery.responsiveSlides.js'],
				dest: 'dist/jquery.responsiveSlides.js'
			},
			options: {
				banner: '<%= meta.banner %>'
			}
		},

		// Lint definitions
		jshint: {
			files: ['src/jquery.responsiveSlides.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ['dist/jquery.responsiveSlides.js'],
				dest: 'dist/jquery.responsiveSlides.min.js'
			},
			options: {
				banner: '<%= meta.banner %>'
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					'dist/jquery.responsiveSlides.js': 'src/jquery.responsiveSlides.coffee'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-coffee');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
