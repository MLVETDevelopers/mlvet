import fetch from 'node-fetch';
import { BUG_REPORT_API_URL } from '../../../constants';

type ReportBug = (title: string, body: string) => Promise<number>;

const reportBug: ReportBug = async (title, body) => {
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
