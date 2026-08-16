# 1. asama: React uygulamasini derle
FROM node:22-alpine AS yapim
WORKDIR /uygulama
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
# Yayin yol oneki. Bos = kok (bugunku davranis). Ornek: --build-arg TEMEL_YOL=/website
ARG TEMEL_YOL=""
ENV TEMEL_YOL=$TEMEL_YOL
RUN npm run build

# 2. asama: statik dosyalari nginx ile sun
FROM nginx:1.27-alpine
ARG TEMEL_YOL=""
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Onek yapilandirmaya islenir; oneksiz build'de tum isaretler bosa duser.
RUN sed -i "s#__ONEK__#${TEMEL_YOL}#g" /etc/nginx/conf.d/default.conf \
 && if [ -n "${TEMEL_YOL}" ]; then \
      sed -i "s#__ONEKSIZ__#location = ${TEMEL_YOL} { return 301 ${TEMEL_YOL}/; }#" /etc/nginx/conf.d/default.conf; \
    else \
      sed -i "s#__ONEKSIZ__##" /etc/nginx/conf.d/default.conf; \
    fi
# nginx'in kendi karsilama sayfasi kalmasin.
RUN rm -f /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY --from=yapim /uygulama/dist /usr/share/nginx/html${TEMEL_YOL}
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
