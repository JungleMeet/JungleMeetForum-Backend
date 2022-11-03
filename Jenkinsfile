pipeline {
	    agent any
	    
	    environment {
	            AWS_CRED = "awsCredentials"
	            IMAGE_TAG = "209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/testapp:v_$BUILD_NUMBER" 
	            oldImage_TAG = "209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/testapp:v_16"
		          Mongo_URL = "${env.MongoDB_Connect}"
		          TMDB_KEY = "${env.TMDB}"
	        }
	    stages{
	                     
	        stage('docker login'){
	            steps{
	                 withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){
	                    sh 'aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 209665464430.dkr.ecr.ap-southeast-2.amazonaws.com'}
	               
	            }
	        }
	    
	        
	        stage('docker build & tag'){
	            steps {
			            sh 'docker build --build-arg mongoConnect=$Mongo_URL --build-arg tmDB=$TMDB_KEY -t junglemeet/testapp . ' 
	                sh 'docker tag junglemeet/testapp 209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/testapp:v_$BUILD_NUMBER'
	                   
	                }
	                
	            }
	        
	        
	        stage('create new td jsonfile'){
	            steps{  
	                script {
	                    sh "sed -i -e 's#${oldImage_TAG}#${IMAGE_TAG}#' ./td-ecs.json"
	                    //sh "jq -r '.containerDefinitions[0].image |= [\\\"$IMAGE_TAG\\\"]' td_ecs.json > new_td-ecs.json"
	                  
	                }
	            }
	        }
	        
	        stage('docker push'){
	            steps{
	                withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){
	                    sh 'docker push --all-tags 209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/testapp'
	                }
	              
	            }
	        }                   
	                         
	        stage('ecs td register'){
	            steps {
	                withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){
	                    sh 'aws ecs register-task-definition --cli-input-json file://td-ecs.json'}
	            }
	        }
	        
	        stage('ecs update'){
	            steps{
	                withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){                    
	                    
	                    sh 'aws ecs update-service --cluster junglemeet-ecs-cluster --service junglemeet-ecs-servicce --task-definition main-app --desired-count 2'
	                }
	            }
	        }    
	            
	        stage('clean'){
	            steps{
	                sh 'docker rmi -f $(docker images -a -q) '
	                    }
	        
	            }
	        }    
	        
	    }
