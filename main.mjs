/*
 * Copyright 2024 Code Inc. <https://www.codeinc.co>
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import express from 'express';
import multer from 'multer';
import * as fs from "fs";
import {PDFExtract} from "pdf.js-extract";

const port = +(process.env.PORT ?? 3000);
const tempDir = 'temp';

const app = express();
const upload = multer({dest: tempDir});

app.post('/convert', upload.single('file'), async (req, res) => {
    if (!req.file.filename) {
        res.status(400);
        res.send({error: 'No file uploaded'});
        return;
    }

    console.log(`Converting PDF ${req.file.originalname} to text`);
    try {
        // extracting the text from the PDF file
        const text = await (
            /** @return {Promise<PDFExtract.PDFExtractResult>} */
            async () => {
                const pdfExtract = new PDFExtract();
                const options = {
                    firstPage: req.body.firstPage ?? 1,
                    lastPage: req.body.lastPage ?? undefined,
                    password: req.body.password ?? undefined,
                    normalizeWhitespace: req.body.normalizeWhitespace !== 'false',
                };

                return new Promise((resolve) => {
                    pdfExtract.extract(req.file.path, options, (err, data) => {
                        if (err) {
                            throw err;
                        }
                        return resolve(data);
                    });
                });
            }
        )();

        // send the text
        if (req.body.raw === "true") {
            let rawText = '';
            text.pages.forEach((page) => {
                rawText += page.content.reduce((acc, content) => acc + content.str, '');
            });

            res.send(rawText);
        } else {
            res.json(text);
        }

        // cleaning up
        fs.unlinkSync(req.file.path);
    }
    catch (e) {
        console.error(e.message);
        res.status(400);
        res.send({error: e.message});
        fs.unlinkSync(req.file.path);
    }
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

