import { ResponseMapper } from '../empathy-adapter.types';

export class GetRaw implements ResponseMapper<number, number> {
  map(from: number): number {
    return from;
  }
}

export class Double implements ResponseMapper<number, number> {
  map(_from: number, to: number): number {
    return to * 2;
  }
}

export class Increment implements ResponseMapper<number, number> {
  map(_from: number, to: number): number {
    return to + 1;
  }

}

export class Decrement implements ResponseMapper<number, number> {
  map(_from: number, to: number): number {
    return to - 1;
  }
}
