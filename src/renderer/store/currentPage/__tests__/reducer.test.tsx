import currentPageReducer from '../reducer';
import { ApplicationPage } from '../helpers';
import { PAGE_CHANGED } from '../actions';

describe('Current Page reducer', () => {
  it('should handle page changed', () => {
    expect(
      currentPageReducer(ApplicationPage.HOME, {
        type: PAGE_CHANGED,
        payload: ApplicationPage.PROJECT,
      })
    ).toEqual(ApplicationPage.PROJECT);
  });
});
