"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssRemProcess = void 0;
const rules_1 = require("./rules");
const vscode_1 = require("vscode");
const config_1 = require("./config");
class CssRemProcess {
    convert(text) {
        const res = this.getRule('single', text);
        if (res.length === 0) {
            return null;
        }
        return res.map(i => i.rule.fn(i.text));
    }
    convertAll(code, ignores, type) {
        if (!code) {
            return code;
        }
        const rule = rules_1.RULES.find(w => w.type === type);
        if (!rule) {
            return code;
        }
        return code.replace(rule.all, (word) => {
            if (ignores.includes(word)) {
                return word;
            }
            const res = rule.fn(word);
            if (res) {
                return res.value;
            }
            return word;
        });
    }
    getRule(type, text) {
        const result = [];
        for (const rule of rules_1.RULES) {
            const match = text.match(rule[type]);
            if (match && match[1]) {
                result.push({ rule, text: match[1] });
            }
        }
        return result;
    }
    getWordRange(textEditor, type) {
        const position = new vscode_1.Position(textEditor.selection.start.line, textEditor.selection.start.character);
        const range = textEditor.document.getWordRangeAtPosition(position);
        if (!range)
            return null;
        const word = textEditor.document.getText(range);
        if (!word)
            return null;
        const rule = rules_1.RULES.find(w => w.type === type);
        return rule && rule.all.test(word) ? range : null;
    }
    modifyDocument(textEditor, ignoresViaCommand, type) {
        const doc = textEditor.document;
        if ((0, config_1.isIngore)(doc.uri))
            return;
        let selection = textEditor.selection;
        // When the cursor is in the valid range in switch mode
        if (selection.isEmpty && type.toLowerCase().includes('switch')) {
            const wordRange = this.getWordRange(textEditor, type);
            if (wordRange) {
                selection = wordRange;
            }
        }
        if (selection.isEmpty) {
            const start = new vscode_1.Position(0, 0);
            const end = new vscode_1.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
            selection = new vscode_1.Range(start, end);
        }
        const text = doc.getText(selection);
        textEditor.edit(builder => {
            builder.replace(selection, this.convertAll(text, ignoresViaCommand, type));
        });
    }
}
exports.CssRemProcess = CssRemProcess;
//# sourceMappingURL=process.js.map