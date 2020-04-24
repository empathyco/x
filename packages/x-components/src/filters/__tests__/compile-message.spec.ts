import { compileMessage } from '../compile-message.filter';

describe(`testing ${compileMessage.name} filter function`, () => {
  const singleKeyMessage = 'This message has {numOfKeys} key';
  const multipleKeysMessage = 'This message has {numOfKeys} {keyStr}';
  const noKeyMessage = 'This message has no keys';

  it('returns the string with the keys replaced', () => {
    expect(compileMessage(singleKeyMessage, { numOfKeys: 'one' })).toEqual(
      'This message has one key'
    );

    expect(compileMessage(multipleKeysMessage, { numOfKeys: 2, keyStr: 'keys' })).toEqual(
      'This message has 2 keys'
    );
  });

  it('returns the same string if it has no keys or no matching keys are provided', () => {
    expect(compileMessage(noKeyMessage, { numOfKeys: 'zero' })).toEqual(noKeyMessage);
    expect(compileMessage(singleKeyMessage, { wrongKey: 'wrongKey' })).toEqual(singleKeyMessage);
  });
});
