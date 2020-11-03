const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const typedoc = require("gulp-typedoc");
const rollup = require('rollup');
const {eslint} = require('rollup-plugin-eslint');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require("@rollup/plugin-commonjs");
const {nodeResolve} = require("@rollup/plugin-node-resolve");

const pkg = require('./package.json');

const paths = {
    root: path.join(__dirname, "/"),
    input: path.join(__dirname, "/src/index.ts"),
    output: path.join(__dirname, "/lib")
}

function clean(callback) {
    fs.rmdirSync("lib", {recursive: true});
    callback();
}

async function build(callback) {
    const bundle = await rollup.rollup({
        input: paths.input,
        plugins: [
            eslint({
                include: ["src/**/*.ts"],
                exclude: ["node_modules/**", "lib/**", "*.js"]
            }),
            commonjs(),
            nodeResolve({
                customResolveOptions: {
                    moduleDirectory: "node_modules",
                }
            }),
            typescript()
        ]
    });
    await bundle.write({
        file: path.join(paths.output, "index.js"),
        format: "cjs",
        name: pkg.name
    });
    await bundle.write({
        file: path.join(paths.output, "index.esm.js"),
        format: "es",
        name: pkg.name
    });
    callback();
}

function doc() {
    return gulp.src("src/*.ts").pipe(
        typedoc({
            out: path.join(paths.output, "/docs"),
            ignoreCompilerErrors: true,
            version: true,
            plugins: []
        })
    );
}

exports.build = build;
exports.default = gulp.series(clean, gulp.parallel(build, doc));
