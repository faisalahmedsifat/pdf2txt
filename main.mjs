/*
 * Copyright 2024 Code Inc. <https://www.codeinc.co>
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import express from 'express';
import multer from 'multer';
import {PDFExtract} from "pdf.js-extract";
import {unlinkSync} from "fs";

const port = +(process.env.PORT ?? 3000);
const tempDir = 'temp';

const app = express();
const upload = multer({dest: tempDir});

app.post('/extract', upload.single('file'), async (req, res) => {
    if (!req.file?.filename) {
        res.status(400);
        res.send({error: 'No file uploaded'});
        return;
    }

    console.log(`Converting PDF ${req.file.originalname} to text`);
    try {
        // extracting the text from the PDF file
        const extractResult = await (
            /** @return {Promise<PDFExtract.PDFExtractResult>} */
            async () => {
                const pdfExtract = new PDFExtract();
                const options = {
                    firstPage: req.body.firstPage ? +req.body.firstPage : 1,
                    lastPage: req.body.lastPage ? +req.body.lastPage : undefined,
                    password: req.body.password ?? undefined,
                    normalizeWhitespace: req.body.normalizeWhitespace !== 'false',
                };

                return new Promise((resolve, reject) => {
                    pdfExtract.extract(req.file.path, options, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        return resolve(data);
                    });
                });
            }
        )();

        // send the content as raw text or JSON
        if (String(req.body.format).toLowerCase() === "json") {
            delete extractResult.filename;

            extractResult.pages.forEach(page => {
                page.content.forEach(content => delete content.fontName);
            });

            res.json(extractResult);
        } else {
            res.send(
                extractResult.pages.reduce(
                    (acc1, page) => {
                        const pageContent = page.content.reduce(
                            (acc2, content) => content.str ? acc2 + '\n' + content.str : acc2,
                            '',
                        );
                        return pageContent ? acc1 + '\n' + pageContent : acc1;
                    },
                    '',
                ).trim(),
            );
        }

        // cleaning up
        unlinkSync(req.file.path);
    }
    catch (e) {
        console.error(`Error converting PDF "${req.file.originalname}" to text: ${e.message}`);
        res.status(400);
        res.send({error: e.message});
        unlinkSync(req.file.path);
    }
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

