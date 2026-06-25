"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssremConfigFileName = exports.cog = void 0;
exports.loadConfig = loadConfig;
exports.isIngore = isIngore;
const fs_1 = require("fs");
const JSONC = require("jsonc-parser");
const path_1 = require("path");
const vscode_1 = require("vscode");
const rules_1 = require("./rules");
const minimatch_1 = require("minimatch");
exports.cssremConfigFileName = '.cssrem';
function loadConfigViaFile() {
    if (vscode_1.workspace.workspaceFolders == null || vscode_1.workspace.workspaceFolders?.length <= 0) {
        return;
    }
    const cssremConfigPath = (0, path_1.join)(vscode_1.workspace.workspaceFolders[0].uri.fsPath, exports.cssremConfigFileName);
    if (!(0, fs_1.existsSync)(cssremConfigPath)) {
        console.log(`Not found file: ${cssremConfigPath}`);
        return;
    }
    try {
        const res = JSONC.parse((0, fs_1.readFileSync)(cssremConfigPath).toString('utf-8'));
        exports.cog = {
            ...exports.cog,
            ...res,
        };
        console.warn(`Use override config via ${cssremConfigPath} file`);
    }
    catch (ex) {
        console.warn(`Parse error in ${cssremConfigPath}`, ex);
    }
}
function fixIngores() {
    if (!Array.isArray(exports.cog.ignores))
        exports.cog.ignores = [];
}
function fixLanguages() {
    if (!Array.isArray(exports.cog.languages))
        exports.cog.languages = [];
    if (exports.cog.languages.length > 0)
        return;
    exports.cog.languages = [
        'html',
        'vue',
        'css',
        'postcss',
        'less',
        'scss',
        'sass',
        'stylus',
        'tpl',
        'wxss',
        'twig',
        'javascriptreact',
        'typescriptreact',
        'javascript',
        'typescript',
    ];
}
function loadConfig() {
    exports.cog = { ...vscode_1.workspace.getConfiguration('cssrem') };
    Object.keys(exports.cog).forEach(key => {
        if (typeof exports.cog[key] === 'function')
            delete exports.cog[key];
    });
    loadConfigViaFile();
    fixIngores();
    fixLanguages();
    (0, rules_1.resetRules)();
    console.log('Current config', exports.cog);
}
function isIngore(uri) {
    return exports.cog.ignores.some(p => (0, minimatch_1.minimatch)(uri.path, p));
}
//# sourceMappingURL=config.js.map