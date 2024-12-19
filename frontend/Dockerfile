FROM node:lts-alpine3.20

EXPOSE 3000

WORKDIR /

ENV NODE_ENV=production

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN npm run build

CMD ["serve"]