"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const process_1 = require("process");
const child_process_1 = require("child_process");
const yargs_1 = __importDefault(require("yargs"));
const argv = yargs_1.default
    .option('name', {
    description: 'The name',
    alias: 'n',
    type: 'string'
})
    .option('route', {
    alias: 'r',
    description: 'The API route to be generated',
    type: 'string'
})
    .option('type', {
    alias: 't',
    description: 'Get or Post requst',
    type: 'string'
})
    .option('path', {
    alias: 'p',
    description: 'The project path',
    type: 'string'
})
    .help()
    .alias('help', 'h')
    .parseSync();
if (argv._[0] === "init") {
    console.log("Initializing project");
    initProject();
}
else if (argv._[0] === "generate-route") {
    if (!argv.path || !argv.name || !argv.route) {
        console.error("Need project path, route for API and name for controller");
        (0, process_1.exit)(1);
    }
    let type = "Get";
    if (argv.type && argv.type === "Get") {
        type = "Get";
    }
    else if (argv.type && argv.type === "Post") {
        type = "Post";
    }
    console.log("TODO Generating code for route: ", argv.route);
    generateApiRoute(argv.path, argv.name, argv.route, type);
}
function createFolderStructure(path, name) {
    try {
        fs_1.default.mkdirSync(path + '/' + name + '/src');
        fs_1.default.mkdirSync(path + '/' + name + '/src/constants');
        fs_1.default.mkdirSync(path + '/' + name + '/src/controllers');
        fs_1.default.mkdirSync(path + '/' + name + '/src/engines');
        fs_1.default.mkdirSync(path + '/' + name + '/src/services');
        fs_1.default.mkdirSync(path + '/' + name + '/src/types');
        fs_1.default.mkdirSync(path + '/' + name + '/build');
        fs_1.default.mkdirSync(path + '/' + name + '/dist');
        fs_1.default.mkdirSync(path + '/' + name + '/scripts');
        fs_1.default.mkdirSync(path + '/' + name + '/static');
        fs_1.default.mkdirSync(path + '/' + name + '/prisma');
    }
    catch (e) {
        console.error(e);
    }
}
async function initProject() {
    const port = GetRandomInt(8000, 9900);
    try {
        const path = process.cwd();
        if (!fs_1.default.existsSync(path + '/package.json')) {
            console.error("package.json file not found, please run `npm init` in the directory first to initialize npm project.");
            (0, process_1.exit)(1);
        }
        const packageJson = JSON.parse(fs_1.default.readFileSync(path + '/package.json', { encoding: 'utf8' }));
        const name = packageJson.name;
        console.log(path, name);
        createFolderStructure(path, name);
        // const git = SimpleGit(path + '/' + name);
        // await git.init();
        // const gitignoreTemplate = fs.readFileSync("./templates/.gitignore.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        // fs.writeFileSync(path + '/' + name + '/.gitignore', gitignoreTemplate);
        packageJson.scripts = {
            "build": "rimraf dist/* && tsoa spec-and-routes && tsc",
            "dev": "npm run build && nodemon src/app.ts",
            "tsoa-gen": "tsoa routes && tsoa swagger",
            "tsoa-swagger": "tsoa swagger",
            "lint": "eslint . --ext .ts",
            "lint-and-fix": "eslint . --ext .ts --fix",
            "prettier-check": "npx prettier --check src",
            "prettier-fix": "npx prettier --write src",
            "pm2": "pm2",
            "start": "pm2 start cluster.json",
            "stop": "pm2 kill",
            "monit": "pm2 monit",
            "update-db-schema": "npx prisma db push && npx prisma generate"
        };
        packageJson.main = "src/app.ts";
        packageJson.dependencies = {
            "@prisma/client": "^4.5.0",
            "compression": "^1.7.4",
            "cors": "^2.8.5",
            "dotenv": "^16.0.3",
            "esm": "^3.2.25",
            "express": "^4.18.1",
            "helmet": "^4.2.0",
            "nodemon": "^2.0.19",
            "pm2": "5.2.0",
            "rxjs": "^7.5.6",
            "swagger-ui-express": "^4.5.0",
            "ts-node": "^10.9.1",
            "tsoa": "^4.1.2",
            "typescript": "^4.8.3",
            "typescript-ioc": "^3.2.2"
        };
        packageJson.devDependencies = {
            "@types/compression": "^1.7.2",
            "@types/cors": "^2.8.12",
            "@types/express": "^4.17.14",
            "@types/node": "^18.7.18",
            "@types/swagger-ui-express": "^4.1.3",
            "@typescript-eslint/eslint-plugin": "^5.37.0",
            "@typescript-eslint/parser": "^5.37.0",
            "eslint": "^8.23.1",
            "eslint-config-prettier": "^8.5.0",
            "eslint-plugin-prettier": "^4.0.0",
            "prettier": "^2.7.1",
            "prisma": "^4.5.0",
            "rimraf": "^3.0.2"
        };
        const childInstall = (0, child_process_1.spawn)('npm', ['install']);
        // const childPrismaClinet = spawn('npm', ['install', 'prisma']);
        // const childCompression = spawn('npm', ['install', 'compression']);
        // const childCors = spawn('npm', ['install', 'cors']);
        // const childDotenv = spawn('npm', ['install', 'dotenv']);
        // const childEsm = spawn('npm', ['install', 'esm']);
        // const childExpress = spawn('npm', ['install', 'express']);
        // const childHelmet = spawn('npm', ['install', 'helmet']);
        // const childNodemon = spawn('npm', ['install', 'nodemon']);
        // const childPm2 = spawn('npm', ['install', 'pm2']);
        // const childRxjs = spawn('npm', ['install', 'rxjs']);
        // const childSwaggerUI = spawn('npm', ['install', 'swagger-ui-express']);
        // const childTsNode = spawn('npm', ['install', 'ts-node']);
        // const childTsoa = spawn('npm', ['install', 'tsoa']);
        // const childTypescript = spawn('npm', ['install', 'typescript']);
        // const childTypescriptIoc = spawn('npm', ['install', 'typescript-ioc']);
        // const childTypesCompression = spawn('npm', ['install', '--save-dev', '@types/compression']);
        // const childTypesCors = spawn('npm', ['install', '--save-dev', '@types/cors']);
        // const childTypesExpress = spawn('npm', ['install', '--save-dev', '@types/express']);
        // const childTypesNode = spawn('npm', ['install', '--save-dev', '@types/node']);
        // const childTypesSwaggerUI = spawn('npm', ['install', '--save-dev', '@types/swagger-ui-express']);
        // const childTypescriptEslintPlugin = spawn('npm', ['install', '--save-dev', '@typescript-eslint/eslint-plugin']);
        // const childTypescriptEslintParser = spawn('npm', ['install', '--save-dev', '@typescript-eslint/parser']);
        // const childEslint = spawn('npm', ['install', '--save-dev', 'eslint']);
        // const childEslintConfigPrettier = spawn('npm', ['install', '--save-dev', 'eslint-config-prettier']);
        // const childEslintPluginPrettier = spawn('npm', ['install', '--save-dev', 'eslint-plugin-prettier']);
        // const childPrettier = spawn('npm', ['install', '--save-dev', 'prettier']);
        // const childPrisma = spawn('npm', ['install', '--save-dev', 'prisma']);
        // const childRimraf = spawn('npm', ['install', '--save-dev', 'rimraf']);
        const replaceName = new RegExp(/\$\{name\}/, 'g');
        const replacePort = new RegExp(/\$\{port\}/, 'g');
        const tsconfigTemplate = fs_1.default.readFileSync("./templates/tsconfig.json.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        const tsoaTemplate = fs_1.default.readFileSync("./templates/tsoa.json.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        const appTemplate = fs_1.default.readFileSync("./templates/app.ts.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        const iocTemplate = fs_1.default.readFileSync("./templates/ioc.ts.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        const prismaTemplate = fs_1.default.readFileSync("./templates/schema.prisma.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        const envTemplate = fs_1.default.readFileSync("./templates/.env.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        const databaseServiceTemplate = fs_1.default.readFileSync("./templates/databaseService.ts.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString());
        const readmeTemplate = fs_1.default.readFileSync("./templates/README.md.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString()).replaceAll(replaceName, name);
        const clusterTemplate = fs_1.default.readFileSync("./templates/cluster.json.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString()).replaceAll(replaceName, name);
        const eslintrcTemplate = fs_1.default.readFileSync("./templates/.eslintrc.json.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString()).replaceAll(replaceName, name);
        const prettierrcTemplate = fs_1.default.readFileSync("./templates/.prettierrc.json.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString()).replaceAll(replaceName, name);
        const eslintignoreTemplate = fs_1.default.readFileSync("./templates/.eslintignore.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString()).replaceAll(replaceName, name);
        const prettierignoreTemplate = fs_1.default.readFileSync("./templates/.prettierignore.template", { encoding: 'utf8' }).replaceAll(replacePort, port.toString()).replaceAll(replaceName, name);
        fs_1.default.writeFileSync(path + '/' + name + '/tsconfig.json', tsconfigTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/tsoa.json', tsoaTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/src/app.ts', appTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/src/ioc.ts', iocTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/prisma/schema.prisma', prismaTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/.env', envTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/src/services/databaseService.ts', databaseServiceTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/README.md', readmeTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/cluster.json', clusterTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/.eslintrc.json', eslintrcTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/.prettierrc.json', prettierrcTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/.eslintignore', eslintignoreTemplate);
        fs_1.default.writeFileSync(path + '/' + name + '/.prettierignore.json', prettierignoreTemplate);
        fs_1.default.openSync(path + '/' + name + '/prisma/dev.db', 'w');
        // Git stuff
        // await git.add(["package.json", "tsconfig.json", "tsoa.json", "src/", "scripts/", "prisma/", "static/", ".gitignore"]);
        // await git.commit(`Initializing project ${name}.\n\nUsing nodejs + express + tsoa + prisma`);
    }
    catch (e) {
        console.error(e);
    }
    console.log('Done!');
}
function generateApiRoute(projectPath, name, route, type) {
    try {
        const replaceName = RegExp(/\$\{name\}/, 'g');
        const replaceRoute = RegExp(/\$\{route\}/, 'g');
        const replaceControllerName = RegExp(/\$\{controllerName\}/, 'g');
        const replaceEngineName = RegExp(/\$\{engineName\}/, 'g');
        const replaceEngineNameCapitalized = RegExp(/\$\{engineNameCapitalized\}/, 'g');
        const replaceType = RegExp(/\$\{type\}/, 'g');
        const controllerName = `${route}Controller`;
        const engineName = `${route}Engine`;
        const controllerTemplate = fs_1.default.readFileSync("./templates/controller.ts.template", { encoding: 'utf8' })
            .replaceAll(replaceName, name)
            .replaceAll(replaceRoute, route)
            .replaceAll(replaceControllerName, capitalize(controllerName))
            .replaceAll(replaceEngineName, engineName)
            .replaceAll(replaceEngineNameCapitalized, capitalize(engineName))
            .replaceAll(replaceType, type);
        const engineTemplate = fs_1.default.readFileSync("./templates/engine.ts.template", { encoding: 'utf8' })
            .replaceAll(replaceName, name)
            .replaceAll(replaceEngineName, capitalize(engineName));
        fs_1.default.writeFileSync(projectPath + '/src/controllers/' + controllerName + '.ts', controllerTemplate);
        fs_1.default.writeFileSync(projectPath + '/src/engines/' + engineName + '.ts', engineTemplate);
    }
    catch (e) {
        console.error(e);
    }
}
/**
 * https://stackoverflow.com/a/1527820
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function GetRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
