/* eslint-disable @typescript-eslint/no-explicit-any */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const getVideo: (req: any, res: any) => void = (_, res) => {
  res.sendFile('assets/sample.mp4', { root: __dirname });
};

app.get('/video', getVideo);

const streamVideo: (req: any, res: any) => void = (req, res) => {
  const sourcePath = 'assets/sample.mp4';
  const stat = fs.statSync(sourcePath);
  const fileSize = stat.size;
  const { range } = req.headers;

  console.log('Range', range);

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(sourcePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(sourcePath).pipe(res);
  }
};

app.get('/video', streamVideo);

app.listen(process.env.PORT, () => {
  console.log(
    `Express Server listening on port ${process.env.IP}:${process.env.PORT}!\n`
  );
});
