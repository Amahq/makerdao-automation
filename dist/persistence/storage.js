"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastWorkedBlockFromStorage = getLastWorkedBlockFromStorage;
exports.updateLastWorkedBlockInStorage = updateLastWorkedBlockInStorage;
const fs_1 = __importDefault(require("fs"));
const STORAGE_FILE = '../Data/jobHistory.json';
function readStorage() {
    if (!fs_1.default.existsSync(STORAGE_FILE))
        return {};
    const data = fs_1.default.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data || '{}');
}
function writeStorage(storage) {
    fs_1.default.writeFileSync(STORAGE_FILE, JSON.stringify(storage, null, 2));
}
function getLastWorkedBlockFromStorage(job) {
    const store = readStorage();
    return store[job]?.lastWorkedBlock ? BigInt(store[job].lastWorkedBlock) : 0n;
}
function updateLastWorkedBlockInStorage(job, blockNumber) {
    const store = readStorage();
    store[job] = { lastWorkedBlock: blockNumber.toString() };
    writeStorage(store);
}
