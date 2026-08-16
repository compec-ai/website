# 1. asama: React uygulamasini derle
FROM node:22-alpine AS yapim
WORKDIR /uygulama
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
RUN npm run build

# 2. asama: statik dosyalari nginx ile sun
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=yapim /uygulama/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
