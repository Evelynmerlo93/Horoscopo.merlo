"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config_1 = require("./config");
const rules_1 = require("./rules");
class default_1 {
    getText(line, pos) {
        const point = pos.character;
        let text = '';
        line.replace(/[.0-9]+(px|rem|rpx|vw)/g, (a, _, idx) => {
            const start = idx + 1;
            const end = idx + a.length + 1;
            if (!text && point >= start && point <= end) {
                text = a;
            }
            return '';
        });
        return text;
    }
    provideHover(doc, pos) {
        if ((0, config_1.isIngore)(doc.uri))
            return null;
        const line = doc.lineAt(pos.line).text.trim();
        const text = this.getText(line, pos);
        if (!text) {
            return null;
        }
        let results = rules_1.RULES.filter(w => w.hover && w.hover.test(text) && w.hoverFn != null)
            .map(rule => rule.hoverFn(text))
            .filter(h => h != null && h.documentation);
        if (config_1.cog.hover === 'onlyMark') {
            results = results.filter(w => !line.includes(`/* ${w.type} */`));
        }
        if (results.length === 0)
            return null;
        if (results.length === 1)
            return new vscode_1.Hover(new vscode_1.MarkdownString(results[0].documentation));
        return new vscode_1.Hover(new vscode_1.MarkdownString(results.map(h => `- ${h.documentation}`).join('\n')));
    }
}
exports.default = default_1;
//# sourceMappingURL=hover.js.map