/* GRUNTFILE.JS */

module.exports = function(grunt) {
	grunt.initConfig({
		shell: {
			handlebars: {
				command: "handlebars src/templates/*.hbs -f src/templates/templates.js -m",
	        	options: {
		            execOptions: {
		                maxBuffer: Infinity
		            }
		        }
        	},
        	distToCordova: {
				command: "cp -rvf dist/* app/www",
	        	options: {
		            execOptions: {
		                maxBuffer: Infinity
		            }
		        }
        	},
        	cordovaEmulate: {
				command: "(cd app; cordova emulate --target='iPhone-6, 9.0')",
	        	options: {
		            execOptions: {
		                maxBuffer: Infinity
		            }
		        }
        	},
        	cordovaBuild: {
				command: "(cd app; cordova build)",
	        	options: {
		            execOptions: {
		                maxBuffer: Infinity
		            }
		        }
        	}
		},
		jshint: {
			options: {
				reporter: require("jshint-stylish"),
				loopfunc: true
			},
			build: ["Gruntfile.js", "src/js/*.js"]
		},
		uglify: {
			"dist/js/main.js" : [
				"bower_components/jquery/dist/jquery.js",
				"bower_components/bootstrap-javascript/bootstrap.min.js",
				"bower_components/handlebars/handlebars.runtime.min.js",
				"bower_components/iscroll/build/iscroll-lite.js",
				"src/js/lib/*.js",
				"src/js/*.js",
				"src/templates/templates.js"
			]
		},
		htmlmin: {
			dist: {
				options: {
					minifyJS: true,
					minifyCSS: true,
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					"dist/index.html" : "src/index.html"
				}
			}
		},
		"json-minify": {
			dist: {
				files: "dist/**/*.json"
			}
		},
		less: {
			dist: {
				files: {
					"dist/css/main.css": "src/less/main.less"
				}
			}
		},
		uncss: {
			dist: {
				files: {
					"dist/css/main.css": "dist/index.html"
				}
			},
			options: {
				ignore: [
					"#calc #stampIn.running",
					"#moreValves div #stampIn.running",
					"#trackerWrapper #infoWrapper",
					"#trackerWrapper",
					"#infoWrapper",
					"#appView",
					"#home",
					"#home .active",
					".appViewContent",
					".appViewContent .active",
					".glyphicons-briefcase",
					".glyphicons-option-vertical",
					".prefSection .glyphicons-option-vertical",
					".prefSection .glyphicons-option-vertical:active",
					".glyphicons-ok-2",
					".glyphicons-circle-plus",
					".glyphicons-floppy-save",
					".glyphicons-floppy-remove",
					".glyphicons-delete",
					".glyphicons-chevron-left",
					".glyphicons-chevron-right",
					".glyphicons-suitcase",
					".glyphicons-money",
					".btn-positive",
					".btn-negative",
					".prefSection",
					".prefSectionWork",
					".prefContent",
					"form",
					".form-inline",
					".form-control",
					"input",
					"label",
					".form-group",
					".sr-only",
					".input-group",
					".input-group-addon",
				]
			}
			
		},
		cssmin: {
			dist: {
				files: {
					"dist/css/main.css": "dist/css/main.css"
				}
			}
		},
		imagemin: {
		    png: {
				options: {
					optimizationLevel: 7
				},
				files: [
					{
				        expand: true,
				        cwd: "src/img/",
				        src: ["*.png"],
				        dest: "dist/img/",
				        ext: ".png"
					}
				]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [
					{
				        expand: true,
				        cwd: "src/img/",
				        src: ["*.jpg"],
				        dest: "dist/img/",
				        ext: ".jpg"
					}
				]
			}
		},
		copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: "src/fonts/",
                    src: ["*.*"],
                    dest: "dist/fonts/"
                }]
            },
            audio: {
                files: [{
                    expand: true,
                    cwd: "src/audio/",
                    src: ["*.*"],
                    dest: "dist/audio/"
                }]
            },
            json: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.json"],
                    dest: "dist/"
                }]
            }
		},
		watch: {
			html: {
				files: "src/index.html",
				tasks: ["htmlmin", "shell:distToCordova", "shell:cordovaEmulate"]
			},
			styles: {
				files: "src/less/*.less",
				tasks: ["less", /*"uncss",*/ "cssmin", "shell:distToCordova", "shell:cordovaEmulate"]
			},
			scripts: {
				files: ["src/js/*.js", "src/templates/*.hbs"],
				tasks: ["shell:handlebars", "jshint", "uglify", "shell:distToCordova", "shell:cordovaEmulate"]
			},
			json: {
				files: ["src/**/*.json"],
				tasks: ["copy:json", "json-minify", "shell:distToCordova", "shell:cordovaEmulate"]
			}
		}
	});
	
	require("load-grunt-tasks")(grunt);
	
	grunt.registerTask("default", ["shell:handlebars", "jshint", "uglify", "htmlmin", "less", /*"uncss",*/ "cssmin", "imagemin", "copy", "json-minify", "shell:distToCordova", "shell:cordovaBuild"]);
};
