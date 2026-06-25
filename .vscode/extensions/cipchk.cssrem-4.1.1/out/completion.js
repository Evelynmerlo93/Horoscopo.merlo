"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config_1 = require("./config");
class default_1 {
    constructor(_, process) {
        this._ = _;
        this.process = process;
    }
    provideCompletionItems(document, position) {
        if ((0, config_1.isIngore)(document.uri))
            return Promise.resolve([]);
        return new Promise(resolve => {
            const lineText = document.getText(new vscode_1.Range(position.with(undefined, 0), position));
            const res = this.process.convert(lineText);
            if (res == null || res.length === 0) {
                return resolve([]);
            }
            return resolve(res.map((i, idx) => {
                const item = new vscode_1.CompletionItem(i.label, vscode_1.CompletionItemKind.Snippet);
                if (i.documentation) {
                    item.documentation = new vscode_1.MarkdownString(i.documentation);
                }
                item.preselect = idx === 0;
                item.insertText = i.value + (config_1.cog.addMark ? ` /* ${i.label} */` : ``);
                return item;
            }));
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=completion.js.map