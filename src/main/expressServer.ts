/* eslint-disable @typescript-eslint/no-explicit-any */
import app from '../expressServer/server';

export default function startExpressServer() {
  const port = process.env.EXPRESS_PORT;

  if (port !== undefined) {
    app.listen(port, () => {
      console.log(`Express Server listening on port :${port}!\n`);
    });
  } else {
    app.listen(() => {
      console.log(`EXPRESS_PORT undefined`);
    });
  }
}
