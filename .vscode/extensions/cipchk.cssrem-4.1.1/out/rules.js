"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULES = void 0;
exports.resetRules = resetRules;
const vscode_1 = require("vscode");
const config_1 = require("./config");
exports.RULES = [];
function cleanZero(val) {
    if (config_1.cog.autoRemovePrefixZero) {
        if (val.toString().startsWith('0.')) {
            return val.toString().substring(1);
        }
    }
    return val + '';
}
function resetRules() {
    exports.RULES.length = 0;
    exports.RULES.push({
        type: 'pxToRem',
        all: /([-]?[\d.]+)px/g,
        single: /([-]?[\d.]+)px?$/,
        fn: text => {
            const px = parseFloat(text);
            const resultValue = +(px / config_1.cog.rootFontSize).toFixed(config_1.cog.fixedDigits);
            const value = cleanZero(resultValue) + 'rem';
            const label = `${px}px -> ${value}`;
            return {
                type: 'pxToRem',
                text,
                px: `${px}px`,
                pxValue: px,
                remValue: resultValue,
                rem: value,
                value,
                label,
                documentation: vscode_1.l10n.t('Convert `{px}px` to `{value}` (the current benchmark font-size is `{rootFontSize}px`', {
                    px,
                    value,
                    rootFontSize: config_1.cog.rootFontSize,
                }),
            };
        },
        hover: config_1.cog.remHover ? /([-]?[\d.]+)px/ : null,
        hoverFn: pxText => {
            const px = parseFloat(pxText);
            const rem = +(px / config_1.cog.rootFontSize).toFixed(config_1.cog.fixedDigits);
            return {
                type: 'remToPx',
                from: `${px}px`,
                to: `${rem}rem`,
                documentation: vscode_1.l10n.t('Converted from `{rem}rem` according to the benchmark font-size is `{rootFontSize}px`', {
                    rem,
                    rootFontSize: config_1.cog.rootFontSize,
                }),
            };
        },
    }, {
        type: 'remToPx',
        all: /([-]?[\d.]+)rem/g,
        single: /([-]?[\d.]+)r(e|em)?$/,
        fn: text => {
            const px = parseFloat(text);
            const resultValue = +(px * config_1.cog.rootFontSize).toFixed(config_1.cog.fixedDigits);
            const value = cleanZero(resultValue) + 'px';
            const label = `${px}rem -> ${value}`;
            return {
                type: 'remToPx',
                text,
                px: `${px}px`,
                pxValue: px,
                remValue: resultValue,
                rem: value,
                value,
                label,
                documentation: vscode_1.l10n.t('Convert {px}rem to {value} (the current benchmark font-size is {rootFontSize}px', {
                    px,
                    value,
                    rootFontSize: config_1.cog.rootFontSize,
                }),
            };
        },
        hover: /([-]?[\d.]+)rem/,
        hoverFn: remText => {
            const rem = parseFloat(remText);
            const px = +(rem * config_1.cog.rootFontSize).toFixed(config_1.cog.fixedDigits);
            return {
                type: 'remToPx',
                from: `${rem}rem`,
                to: `${px}px`,
                documentation: vscode_1.l10n.t('Converted from `{px}px` according to the benchmark font-size is `{rootFontSize}px`', {
                    px,
                    rootFontSize: config_1.cog.rootFontSize,
                }),
            };
        },
    }, {
        type: 'pxSwitchRem',
        all: /([-]?[\d.]+)(rem|px)/g,
        fn: text => {
            const type = text.endsWith('px') ? 'pxToRem' : 'remToPx';
            const rule = exports.RULES.find(r => r.type === type);
            return rule?.fn(text);
        },
    });
    if (config_1.cog.vw) {
        exports.RULES.push({
            type: 'pxToVw',
            all: /([-]?[\d.]+)px/g,
            single: /([-]?[\d.]+)px?$/,
            fn: text => {
                const px = parseFloat(text);
                const resultValue = +(px / (config_1.cog.vwDesign / 100.0)).toFixed(config_1.cog.fixedDigits);
                const vw = cleanZero(resultValue) + 'vw';
                const label = `${px}px -> ${vw}`;
                return {
                    type: 'pxToVw',
                    text,
                    px: `${px}px`,
                    pxValue: px,
                    vwValue: resultValue,
                    vw: vw,
                    value: vw,
                    label,
                    documentation: vscode_1.l10n.t('Convert `{px}px` to `{vw}` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)', {
                        px,
                        value: vw,
                        vwDesign: config_1.cog.vwDesign,
                        rootFontSize: config_1.cog.rootFontSize,
                    }),
                };
            },
            hover: config_1.cog.vwHover ? /([-]?[\d.]+)px/ : null,
            hoverFn: pxText => {
                const px = parseFloat(pxText);
                const vw = +(px / (config_1.cog.vwDesign / 100.0)).toFixed(config_1.cog.fixedDigits);
                return {
                    type: 'pxToVw',
                    from: `${px}px`,
                    to: `${vw}vw`,
                    documentation: vscode_1.l10n.t('Convert `{px}px` to `{vw}vw` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)', {
                        px,
                        vw,
                        vwDesign: config_1.cog.vwDesign,
                        rootFontSize: config_1.cog.rootFontSize,
                    }),
                };
            },
        }, {
            type: 'vwToPx',
            all: /([-]?[\d.]+)vw/g,
            single: /([-]?[\d.]+)vw?$/,
            fn: text => {
                const vw = parseFloat(text);
                const resultValue = +(vw * (config_1.cog.vwDesign / 100.0)).toFixed(config_1.cog.fixedDigits);
                const px = cleanZero(resultValue) + 'px';
                const label = `${vw}vw -> ${px}`;
                return {
                    type: 'vwToPx',
                    text,
                    px: `${vw}px`,
                    pxValue: vw,
                    vwValue: resultValue,
                    vw: px,
                    value: px,
                    label,
                    documentation: vscode_1.l10n.t('Convert `{vw}vw` to `{px}` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)', {
                        vw,
                        px,
                        vwDesign: config_1.cog.vwDesign,
                        rootFontSize: config_1.cog.rootFontSize,
                    }),
                };
            },
            hover: /([-]?[\d.]+)vw/,
            hoverFn: rpxText => {
                const vw = parseFloat(rpxText);
                const px = +(vw * (config_1.cog.vwDesign / 100.0)).toFixed(config_1.cog.fixedDigits);
                return {
                    type: 'vwToPx',
                    from: `${vw}vw`,
                    to: `${px}px`,
                    documentation: vscode_1.l10n.t('Converted from `{px}px` (current device width `{vwDesign}px`, base font size is `{rootFontSize}px`)', {
                        px,
                        vwDesign: config_1.cog.vwDesign,
                        rootFontSize: config_1.cog.rootFontSize,
                    }),
                };
            },
        }, {
            type: 'vwSwitchPx',
            all: /([-]?[\d.]+)(vw|px)/g,
            fn: text => {
                const type = text.endsWith('px') ? 'pxToVw' : 'vwToPx';
                const rule = exports.RULES.find(r => r.type === type);
                return rule?.fn(text);
            },
        });
    }
    if (config_1.cog.wxss) {
        exports.RULES.push({
            type: 'pxToRpx',
            all: /([-]?[\d.]+)px/g,
            single: /([-]?[\d.]+)px?$/,
            fn: text => {
                const px = parseFloat(text);
                const resultValue = +(px * (config_1.cog.wxssScreenWidth / config_1.cog.wxssDeviceWidth)).toFixed(config_1.cog.fixedDigits);
                const rpx = cleanZero(resultValue) + 'rpx';
                const label = `${px}px -> ${rpx}`;
                return {
                    type: 'pxToRpx',
                    text,
                    px: `${px}px`,
                    pxValue: px,
                    rpxValue: resultValue,
                    rpx: rpx,
                    value: rpx,
                    label,
                    documentation: vscode_1.l10n.t('**WXSS miniprogram style** Convert `{px}px` to `{rpx}` (the current device width is `{wxssDeviceWidth}px` and screen width is `{wxssScreenWidth}px`)', {
                        px,
                        rpx,
                        wxssDeviceWidth: config_1.cog.wxssDeviceWidth,
                        wxssScreenWidth: config_1.cog.wxssScreenWidth,
                    }),
                };
            },
        }, {
            type: 'rpxToPx',
            all: /([-]?[\d.]+)rpx/g,
            single: /([-]?[\d.]+)r(p|px)?$/,
            fn: text => {
                const rpx = parseFloat(text);
                const resultValue = +(rpx / (config_1.cog.wxssScreenWidth / config_1.cog.wxssDeviceWidth)).toFixed(config_1.cog.fixedDigits);
                const px = cleanZero(resultValue) + 'px';
                const label = `${rpx}rpx -> ${px}px`;
                return {
                    type: 'rpxToPx',
                    text,
                    px: `${rpx}px`,
                    pxValue: rpx,
                    rpxValue: resultValue,
                    rpx: px,
                    value: px,
                    label,
                    documentation: vscode_1.l10n.t('**WXSS miniprogram style** Convert `{rpx}rpx` to `{px}` (The current device width is `{wxssDeviceWidth}px` and screen width is `{wxssScreenWidth}px`)', {
                        rpx,
                        px,
                        wxssDeviceWidth: config_1.cog.wxssDeviceWidth,
                        wxssScreenWidth: config_1.cog.wxssScreenWidth,
                    }),
                };
            },
            hover: /([-]?[\d.]+)rpx/,
            hoverFn: rpxText => {
                const rpx = parseFloat(rpxText);
                const px = +(rpx / (config_1.cog.wxssScreenWidth / config_1.cog.wxssDeviceWidth)).toFixed(config_1.cog.fixedDigits);
                return {
                    type: 'rpxToPx',
                    from: `${rpx}rpx`,
                    to: `${px}px`,
                    documentation: vscode_1.l10n.t('**WXSS miniprogram style** Converted from `{px}px` (The current device width is `{wxssDeviceWidth}px` and screen width is `{wxssScreenWidth}px`)', {
                        px,
                        wxssDeviceWidth: config_1.cog.wxssDeviceWidth,
                        wxssScreenWidth: config_1.cog.wxssScreenWidth,
                    }),
                };
            },
        }, {
            type: 'rpxSwitchPx',
            all: /([-]?[\d.]+)(rpx|px)/g,
            fn: text => {
                const type = text.endsWith('rpx') ? 'rpxToPx' : 'pxToRpx';
                const rule = exports.RULES.find(r => r.type === type);
                return rule?.fn(text);
            },
        });
    }
}
//# sourceMappingURL=rules.js.map