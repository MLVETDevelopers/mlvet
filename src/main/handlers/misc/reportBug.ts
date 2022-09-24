import fetch from 'node-fetch';
import { BUG_REPORT_API_URL } from '../../../constants';

const reportBug = async (title: string, body: string) => {
  const response = await fetch(BUG_REPORT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description: body,
    }),
  });
  return response.status;
};

export default reportBug;
