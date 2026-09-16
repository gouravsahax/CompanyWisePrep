import { prisma } from '../lib/prisma';
const keys = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
console.log("PRISMA KEYS:", keys);
