####################################################################################################
# PDF2TEXT
####################################################################################################
FROM --platform=$TARGETPLATFORM node:21-alpine AS pdf2text

ENV PORT=3000
ENV NODE_ENV=production
WORKDIR /app


####################################################################################################
# PDF2TEXT dev
####################################################################################################
FROM pdf2text AS pdf2text-dev

ENV NODE_ENV=development
RUN npm install --global nodemon

EXPOSE $PORT
ENTRYPOINT ["nodemon", "main.mjs"]


####################################################################################################
# PDF2TEXT prod
####################################################################################################
FROM pdf2text AS pdf2text-prod

COPY main.mjs /app/
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install --omit=dev

EXPOSE $PORT
ENTRYPOINT ["node", "main.mjs"]