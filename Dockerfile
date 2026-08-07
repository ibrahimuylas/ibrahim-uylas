FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY site/public/ /usr/share/nginx/html/

EXPOSE 3333

CMD ["nginx", "-g", "daemon off;"]
