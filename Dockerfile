####################################################################################################
# PDF2TXT
####################################################################################################
FROM --platform=$TARGETPLATFORM node:lts-slim AS pdf2txt

ENV PORT=3000
ENV NODE_ENV=production
WORKDIR /app


####################################################################################################
# PDF2TXT dev
####################################################################################################
FROM pdf2txt AS pdf2txt-dev

ENV NODE_ENV=development
RUN npm install --global nodemon

EXPOSE $PORT
ENTRYPOINT ["nodemon", "main.mjs"]


####################################################################################################
# PDF2TXT prod
####################################################################################################
FROM pdf2txt AS pdf2txt-prod

COPY main.mjs /app/
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install --omit=dev

EXPOSE $PORT
ENTRYPOINT ["node", "main.mjs"]