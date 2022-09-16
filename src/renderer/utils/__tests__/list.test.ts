import { mapInRange } from '../../../sharedUtils';

// TODO move this file
describe('list utils', () => {
  it('should map values in specified range successfully while ignoring others', () => {
    expect(
      mapInRange(
        [true, false, true, false, true, false, true, true, false, false, true],
        () => false,
        { startIndex: 0, endIndex: 3 }
      )
    ).toEqual([
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
    ]);
  });
});
