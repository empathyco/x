import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

describe('random', () => {
  it('does things', () => {
    const result: string[] = [];
    const sub = new Subject();
    const subRep = sub.pipe(shareReplay(1));
    sub.pipe(shareReplay(1)).subscribe(next => result.push('Sub 1 - ' + next));
    sub.next(1);
    sub.next(2);
    sub.pipe(shareReplay(1)).subscribe(next => result.push('Sub 2 - ' + next));
    sub.next(3);

    expect(result).toEqual([]);
  });
});
