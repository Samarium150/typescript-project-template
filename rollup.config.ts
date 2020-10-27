import path from "path";
import typescript from "rollup-plugin-typescript2";
import {eslint} from "rollup-plugin-eslint";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import pkg from "./package.json"

const io = {
    input: path.join(__dirname, "/src/index.ts"),
    output: path.join(__dirname, "/lib")
}

const config = {
    input: io.input,
    output: [
        {
            file: path.join(io.output, "index.js"),
            format: "cjs",
            name: pkg.name
        },
        {
            file: path.join(io.output, "index.esm.js"),
            format: "es",
            name: pkg.name
        }
    ],
    plugins: [
        eslint(
            {
                include: ["src/**/*.ts"],
                exclude: ["node_modules/**", "lib/**", "*.js"]
            }
        ),
        commonjs(),
        resolve(
            {
                customResolveOptions: {
                    moduleDirectory: "node_modules",
                }
            }
        ),
        typescript()
    ]
}

export default config;
