# Verwende ein leichtes Nginx-Image als Basis
FROM nginx:alpine

# Kopiere die Inhalte des "src"-Ordners in das Standardverzeichnis von Nginx
COPY src /usr/share/nginx/html

# Exponiere den Standardport von Nginx
EXPOSE 80

# Nginx wird automatisch gestartet, da es das Standardkommando des Images ist