import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store/store';

import StoreChangeObserver from '../StoreChangeObserver';

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
