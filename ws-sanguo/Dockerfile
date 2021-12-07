FROM node:12.22.3
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
ADD . /skynet-web
RUN cd /skynet-web && cnpm install && cnpm run build
FROM nginx
COPY --from=0 /skynet-web/dist /usr/share/nginx/html