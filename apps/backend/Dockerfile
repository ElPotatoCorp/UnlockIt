FROM node:22-alpine AS deps
WORKDIR /srv/backend

COPY package*.json ./
RUN npm install

FROM node:22-alpine AS build
WORKDIR /srv/backend

COPY package*.json ./
COPY --from=deps /srv/backend/node_modules ./node_modules
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /srv/backend
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /srv/backend/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]