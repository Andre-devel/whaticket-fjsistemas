FROM node:20-alpine as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY .env* ./
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
RUN npm install --omit=dev express@4.21.2
COPY --from=build-deps /usr/src/app/build ./build
COPY server.js ./
ENV NODE_ENV=production
EXPOSE 80
CMD ["node", "server.js"]
