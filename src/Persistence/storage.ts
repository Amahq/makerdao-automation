import fs from 'fs';
import { Address } from 'viem';

type JobHistory = {
  [job: Address]: {
    lastWorkedBlock: string; // store as string to avoid JSON int issues
  };
};

const STORAGE_FILE = '../Data/jobHistory.json';

function readStorage(): JobHistory {
  if (!fs.existsSync(STORAGE_FILE)) return {};
  const data = fs.readFileSync(STORAGE_FILE, 'utf8');
  return JSON.parse(data || '{}');
}

function writeStorage(storage: JobHistory) {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(storage, null, 2));
}

export function getLastWorkedBlockFromStorage(job: Address): bigint {
  const store = readStorage();
  return store[job]?.lastWorkedBlock ? BigInt(store[job].lastWorkedBlock) : 0n;
}

export function updateLastWorkedBlockInStorage(
  job: Address,
  blockNumber: bigint,
) {
  const store = readStorage();
  store[job] = { lastWorkedBlock: blockNumber.toString() };
  writeStorage(store);
}
