import fetch from 'node-fetch';

const reportBug = async (title: string, body: string) => {
  try {
    await fetch(
      'https://mlvet-bug-reporter-mlvet-bug-reporter-9xw6.vercel.app/api/reportBug',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // eslint-disable-next-line object-shorthand
          title: title,
          description: body,
        }),
      }
    );
    return 200;
  } catch (e) {
    console.error(e);
    return -1;
  }
};

export default reportBug;
