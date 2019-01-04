# Stage 1 - the build process
FROM node:11.6-alpine as build
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.15-alpine
COPY --from=build /opt/app/build /usr/share/nginx/html
WORKDIR /etc/nginx
COPY nginx conf.d/