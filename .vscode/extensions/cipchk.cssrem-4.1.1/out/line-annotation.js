"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineAnnotation = void 0;
const vscode_1 = require("vscode");
const config_1 = require("./config");
const rules_1 = require("./rules");
const annotationDecoration = vscode_1.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 1.5em',
        textDecoration: 'none',
    },
    rangeBehavior: vscode_1.DecorationRangeBehavior.ClosedOpen,
});
class LineAnnotation {
    constructor() {
        this._enabled = false;
        this._disposable = vscode_1.Disposable.from(vscode_1.window.onDidChangeActiveTextEditor(this.onActiveTextEditor, this), vscode_1.window.onDidChangeTextEditorSelection(this.onTextEditorSelectionChanged, this));
    }
    onActiveTextEditor(e) {
        if (e == null)
            return;
        this._enabled = config_1.cog.languages.includes(e.document.languageId) && !(0, config_1.isIngore)(e.document.uri);
    }
    onTextEditorSelectionChanged(e) {
        if (!this._enabled)
            return;
        if (!this.isTextEditor(e.textEditor))
            return;
        const selections = this.toLineSelections(e.selections);
        if (selections?.length === 0 || !selections?.every(s => s.active === s.anchor)) {
            this.clear(e.textEditor);
            return;
        }
        this.refresh(e.textEditor, selections[0]);
    }
    async refresh(editor, selection) {
        if (editor?.document == null || (editor == null && this._editor == null))
            return;
        if (this._editor !== editor) {
            this.clear(this._editor);
            this._editor = editor;
        }
        const l = selection.active;
        const message = this.genMessage(editor.document, l);
        if (message == null) {
            this.clear(this._editor);
            return;
        }
        const decoration = {
            renderOptions: {
                after: {
                    backgroundColor: new vscode_1.ThemeColor('extension.cssrem.trailingLineBackgroundColor'),
                    color: new vscode_1.ThemeColor('extension.cssrem.trailingLineForegroundColor'),
                    contentText: message,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                },
            },
            range: editor.document.validateRange(new vscode_1.Range(l, Number.MAX_SAFE_INTEGER, l, Number.MAX_SAFE_INTEGER)),
        };
        editor.setDecorations(annotationDecoration, [decoration]);
    }
    genMessage(doc, lineNumber) {
        const text = doc.lineAt(lineNumber).text.trim();
        if (text.length <= 0)
            return null;
        const values = text.match(/([.0-9]+(px|rem|rpx|vw))/g);
        if (values == null)
            return null;
        const results = values
            .map(str => ({ text: str, rule: rules_1.RULES.filter(w => w.hover && w.hover.test(str) && w.hoverFn != null).map(h => h.hoverFn(str)) }))
            .filter(item => item.rule.length > 0);
        if (results.length <= 0)
            return null;
        if (results.length === 1)
            return this.genMessageItem(results[0].rule);
        return results.map(res => this.genMessageItem(res.rule)).join(', ');
    }
    genMessageItem(rules) {
        if (rules.length === 1)
            return rules[0].to;
        return (`${rules[0].to}->${rules[0].from}(` +
            rules
                .slice(1)
                .map(v => `${v.to}->${v.from}`)
                .join(',') +
            ')');
    }
    clear(editor) {
        if (this._editor !== editor && this._editor != null) {
            this.clearAnnotations(this._editor);
        }
        this.clearAnnotations(editor);
    }
    clearAnnotations(editor) {
        if (editor === undefined || editor._disposed === true)
            return;
        editor.setDecorations(annotationDecoration, []);
    }
    isTextEditor(editor) {
        const scheme = editor.document.uri.scheme;
        return scheme !== 'output' && scheme !== 'debug';
    }
    dispose() {
        this.clearAnnotations(this._editor);
        this._disposable?.dispose();
    }
    toLineSelections(selections) {
        return selections?.map(s => ({ active: s.active.line, anchor: s.anchor.line }));
    }
}
exports.LineAnnotation = LineAnnotation;
//# sourceMappingURL=line-annotation.js.map