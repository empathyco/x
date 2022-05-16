import { Mapper } from '../../mapper.types';

export const decrement: Mapper<number, number> = from => from - 1;

export const double: Mapper<number, number> = from => from * 2;

export const raw: Mapper<number, number> = from => from;

export const increment: Mapper<number, number> = from => from + 1;

export const toString: Mapper<number, string> = from => from.toString();

export const toNumber: Mapper<string, number> = from => parseInt(from);
