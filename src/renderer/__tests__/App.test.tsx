import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import App from '../App';

describe('App', () => {
  /**
   * We test StoreChangeObserver separately from the rest of the App component as it does some async logic
   * (loading recent projects from IPC). This can be worked around with 'waitFor' but unfortunately MUI's Modal
   * component breaks when we do that. So for now we test separately
   */
  it('should render successfully without wait when StoreChangeObserver is disabled', async () => {
    const rendered = render(<App hasStoreChangeObserver={false} />);

    expect(rendered).toBeTruthy();
  });
});
