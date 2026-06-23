FROM node:22-alpine AS reactapp

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build


FROM nginx

RUN rm -rf /usr/share/nginx/html/*

COPY --from=reactapp /app/dist /usr/share/nginx/html

CMD [ "nginx" , "-g" , "daemon off;" ]