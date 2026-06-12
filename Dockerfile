# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install
COPY . .

# Recibir la URL de la API como argumento para inyectarla en el build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Construir app (Vite inyectará VITE_API_URL estáticamente)
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
# Copiar el build compilado
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar configuración personalizada de Nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
