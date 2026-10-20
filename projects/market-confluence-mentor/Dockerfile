FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node . .
RUN mkdir -p /app/data && chown node:node /app/data
USER node
ENV BIND_HOST=0.0.0.0 DATA_DIR=/app/data
EXPOSE 8080
CMD ["node", "server.cjs"]
