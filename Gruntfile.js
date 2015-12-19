module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      "build": ["build"],
      "elm-stuff": ["elm-stuff"],
      "node_modules": ["node_modules"]
    },

    shell: {
      'elm-make': {
        command: 'elm make src/main/elm/Main.elm --yes --output build/main.js'
      }
    },

    watch: {
      "elm": {
        files: [
          'src/main/elm/**/*.elm',
          'src/main/elm/**/*.js'
        ],
        tasks: ['elm-make'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      "js": {
        files: ['src/main/static-web/**/*'],
        tasks: [],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  grunt.registerTask("default", function () {
    grunt.task.run("elm-make");
  });

  grunt.registerTask("elm-make", function () {
    grunt.task.run("shell:elm-make");
  });
};