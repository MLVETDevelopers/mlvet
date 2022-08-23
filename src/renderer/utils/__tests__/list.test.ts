import { mapInRanges } from '../list';

describe('list utils', () => {
  it('should map values in specified ranges successfully while ignoring others', () => {
    expect(
      mapInRanges(
        [true, false, true, false, true, false, true, true, false, false, true],
        () => false,
        [
          { startIndex: 0, endIndex: 3 },
          { startIndex: 7, endIndex: 8 },
        ]
      )
    ).toEqual([
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      false,
      false,
      true,
    ]);
  });
});
