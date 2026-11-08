// meta-design vendor entry — bundled once by scripts/build.mjs.
// Exposes window.AstryxKit = {React, ReactDOM, htm, Astryx} for classic
// <script src> pages that stay file://-runnable (no ES modules, no CORS).
export * as React from 'react';
export * as ReactDOM from 'react-dom/client';
export {default as htm} from 'htm';
export * as Astryx from '@astryxdesign/core';
export {default as zhCN} from '@astryxdesign/core/locales/zh-CN.generated.js';
