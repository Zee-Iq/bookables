FROM node:16-alpine
ARG REACT_APP_BING_MAPS
ENV REACT_APP_BING_MAPS=${REACT_APP_BING_MAPS}
RUN if [ -z "$REACT_APP_BING_MAPS" ]; then echo 'Environment variable REACT_APP_BING_MAPS must be specified. Exiting.'; exit 1; fi
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN mv ./Server/build/* ./
RUN mkdir ./public 
RUN mv ./Client/build/* ./public
RUN rm -rf node_modules
RUN rm -rf ./Client
RUN rm -rf ./types
RUN npm install -w Server --production
RUN rm -rf ./Server
RUN rm -rf ./.git
RUN rm -rf ./.gitignore
RUN rm -rf ./dockerfile
RUN rm -rf ./package-lock.json
RUN rm -rf ./package.json
CMD ["node", "./server.js"]
