FROM node:16

WORKDIR /usr/src/app
		
	
ARG mongoConnect
ARG tmDB
ARG JWT_SECRET
ARG JWT_EXPIRE_TIME

ENV MONGO_URI=$mongoConnect
ENV TMDB=$tmDB
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRE_TIME=$JWT_EXPIRE_TIME
		
COPY package*.json ./
		
RUN npm install
		
COPY . .
		
EXPOSE 3000
CMD [ "node", "app.js" ]
