import { mapInRange } from 'renderer/util';

describe('mapInRange', () => {
  it('should map values in a range successfully while ignoring others', () => {
    expect(
      mapInRange(
        [true, false, true, false, true, false, true, true, false, false],
        () => false,
        3,
        6
      )
    ).toEqual([
      true,
      false,
      true,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
    ]);
  });
});
