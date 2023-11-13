"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmp = __importStar(require("tmp"));
const fs = __importStar(require("node:fs"));
async function jobArrived(s, flowElement, job) {
    await job.sendToSingle();
}
async function flowStartTriggered(s, flowElement) {
    const tempDir = tmp.dirSync({ prefix: 'FlowLinks', unsafeCleanup: true });
    await s.setGlobalData(Scope.FlowElement, 'tempDest', tempDir.name);
    const Channel = (await flowElement.getPropertyStringValue('Channel'));
    try {
        await flowElement.subscribeToChannel(Channel, tempDir.name);
        await flowElement.log(LogLevel.Warning, "Subscribed to '%1' channel in folder '%2'", [Channel, tempDir.name]);
    }
    catch (error) {
        await flowElement.log(LogLevel.Error, `Channel ${Channel} already subscribed to`);
    }
}
async function flowStopTriggered(s, flowElement) {
    const tempDest = await s.getGlobalData(Scope.FlowElement, 'tempDest');
    try {
        fs.rmdirSync(tempDest);
    }
    catch (error) {
        await flowElement.log(LogLevel.Error, `Failed to delete the directory created for the channel: ${tempDest}`);
    }
}
//# sourceMappingURL=main.js.map