import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store/store';

import StoreChangeObserver from '../StoreChangeObserver';

jest.mock('@react-hook/debounce', () => {
  return {
    useDebounce: jest.fn((value) => [value, () => null]),
  };
});

describe('StoreChangeObserver', () => {
  it('should render successfully', async () => {
    const rendered = render(
      <Provider store={store}>
        <StoreChangeObserver />
      </Provider>
    );

    waitFor(() => {
      expect(rendered).toBeTruthy();
    });
  });
});
