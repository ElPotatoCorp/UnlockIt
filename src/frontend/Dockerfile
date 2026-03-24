FROM node:22-alpine AS deps
WORKDIR /srv/frontend

COPY package*.json ./
RUN npm install

FROM node:22-alpine AS build
WORKDIR /srv/frontend

COPY package*.json ./
COPY --from=deps /srv/frontend/node_modules ./node_modules
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY --from=build /srv/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]