// Capture the native Promise API before Dark Reader installs its API message shim.
globalThis.lunaSendMessage = chrome.runtime.sendMessage.bind(chrome.runtime);
