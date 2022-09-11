import { secondToEDLTimestamp } from '../../timeUtils';

describe('Test second to time stamp function', () => {
  it('should produce expected time stamp with input millisecond is 0', () => {
    const inputMillisec = 0;

    const outputMillisec = secondToEDLTimestamp(inputMillisec);

    const expectedTimestamp = '00:00:00:00';

    expect(outputMillisec).toEqual(expectedTimestamp);
  });

  it('should produce expected time stamp with postive integer input millisecond', () => {
    const inputMillisec = 10;

    const outputMillisec = secondToEDLTimestamp(inputMillisec);

    const expectedTimestamp = '00:00:10:00';

    expect(outputMillisec).toEqual(expectedTimestamp);
  });

  it('should produce expected time stamp with postive decimals input millisecond', () => {
    const inputMillisec = 10.4267;

    const outputMillisec = secondToEDLTimestamp(inputMillisec);

    const expectedTimestamp = '00:00:10:42';

    expect(outputMillisec).toEqual(expectedTimestamp);
  });

  it('should throw error with negative input millisecond', () => {
    const inputMillisec = -10;
    const expectError = Error('Negative Input');

    let thrownError;
    try {
      secondToEDLTimestamp(inputMillisec);
    } catch (e) {
      thrownError = e;
    }

    expect(thrownError).toEqual(expectError);
  });
});
