# pdf2image

[![Docker Image CI](https://github.com/codeinchq/pdf2text/actions/workflows/docker-image.yml/badge.svg)](https://github.com/codeinchq/pdf2text/actions/workflows/docker-image.yml)

This repository contains a simple containerized API to convert PDF documents to text using [Mozilla's pdf.js](https://mozilla.github.io/pdf.js/) and [pdf.js-extract](https://www.npmjs.com/package/pdf.js-extract).

The image is available on [Docker Hub](https://hub.docker.com/r/codeinchq/pdf2text) under the name `codeinchq/pdf2text`.

## Configuration

By default, the container listens on port 3000. The port is configurable using the `PORT` environment variable.

## Usage

All requests must by send in POST to the `/convert` endpoint with a `multipart/form-data` content type. The request must contain a PDF file with the key `file`. 

Additional parameters can be sent to customize the conversion process:
* `raw`: If set to `true`, the server returns the raw text extracted from the PDF as `text/plain`, else the text is return in JSON format. Default is `false`.
* `firstPage`: The first page to extract. Default is `1`.
* `lastPage`: The last page to extract. Default is the last page of the document.
* `password`: The password to unlock the PDF. Default is none.
* `normalizeWhitespace`: If set to `true`, the server normalizes the whitespace in the extracted text. Default is `true`.

The server returns `200` if the conversion was successful and the images are available in the response body. In case of error, the server returns a `400` status code with a JSON object containing the error message (format: `{error: string}`).

## Example

### Step 1: run the container using Docker
```bash
docker run -p "3000:3000" codeinchq/pdf2text 
```

### Step 2: convert a PDF file to text
Convert a PDF file to text with a JSON response:
```bash
curl -X POST -F "file=@/path/to/file.pdf" http://localhost:3000/convert -o example.json
```

Convert a password-protected PDF file to text with a JSON response:
```bash
curl -X POST -F "file=@/path/to/file.pdf" -F "password=XXX" http://localhost:3000/convert -o example.json
```

Convert a PDF file to text with a raw text response:
```bash
curl -X POST -F "file=@/path/to/file.pdf" -F "raw=true" http://localhost:3000/convert -o example.txt
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
