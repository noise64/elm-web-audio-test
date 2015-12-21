module.exports = function (grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    clean: {
      "build": ["build"],
      "elm-stuff": ["elm-stuff"],
      "node_modules": ["node_modules"]
    },

    shell: {
      "elm-make": {
        command: "elm make src/main/elm/Main.elm --yes --output build/main.js"
      },
    },

    copy: {
      "static-web": {
        expand: true,
        cwd: "src/main/static-web",
        src: "**",
        dest: "build/"
      },
    },

    watch: {
      "elm": {
        files: [
          "src/main/elm/**/*.elm",
          "src/main/elm/**/*.js"
        ],
        tasks: ["elm-make"],
        options: {
          spawn: false,
          livereload: true
        }
      },
      "static-web": {
        files: ["src/main/static-web/**/*"],
        tasks: ["copy:static-web"],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  });

  grunt.registerTask("default", function () {
    grunt.task.run("clean:build");
    grunt.task.run("elm-make");
    grunt.task.run("copy:static-web");
  });

  grunt.registerTask("elm-make", function () {
    grunt.task.run("shell:elm-make");
  });
};