	FROM node:16
	# Create app directory
	WORKDIR /usr/src/app
		
	

	ARG mongoConnect
	ARG tmDB
	#ARG jwtSecret
	#ARG jwtExpireTime
	ENV MONGO_URI=$mongoConnect
	ENV TMDB=$tmDB
	#ENV JWT_SECRET = ${jwtSecret}
	#ENV JWT_EXPIRE_TIME = ${jwtExpireTime}
		
	

	COPY package*.json ./
		
	

	RUN npm install
		
	

	COPY . .
		
	

	EXPOSE 3000
	CMD [ "node", "app.js" ]
