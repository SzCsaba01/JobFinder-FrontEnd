FROM node:20.11.1 AS build

WORKDIR /usr/src/app

RUN npm install -g @angular/cli@17.3.8

COPY package*.json ./

RUN npm install

COPY . .

RUN ng build --configuration=production --base-href=/ --output-path=dist

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]