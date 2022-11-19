pipeline {
	    agent any
	    
	    environment {
	            AWS_CRED 		= "awsCredentials"
	            IMAGE_TAG 		= "209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/myapp:v_$BUILD_NUMBER" 
	            oldImage_TAG 	= "209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/myapp:latest"
		    Mongo_URL 		= "${env.MongoDB_Connect}"
		    TMDB_KEY 		= "${env.TMDB}"
	        }
	    stages{
		
		stage('code scanning'){
            		environment {	scannerHome = tool 'CliScanner'	}
            		steps {
                		withSonarQubeEnv('sq'){
                        			echo 'Start Scanning...'
                        			sh '${scannerHome}/bin/sonar-scanner'
                				}
            			}
        		}
        
        	stage('qulityGate'){
            		steps{
                  		script{
                      			def qg = waitForQualityGate(webhookSecretId: 'sqToken') // Reuse taskId previously collected by withSonarQubeEnv
                        		  if (qg.status != 'OK') {
                            		    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        			}
                  			}    
            			}
        		}    
	                     
	        stage('docker login'){
	            steps{
	                 withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){
	                    sh 'aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 209665464430.dkr.ecr.ap-southeast-2.amazonaws.com'}
	               
	            }
	        }
	    
	        
	        stage('docker build & tag'){
	            steps {
			sh 'docker build --build-arg mongoConnect=$Mongo_URL --build-arg tmDB=$TMDB_KEY -t junglemeet/myapp . ' 
	                sh 'docker tag junglemeet/myapp 209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/myapp:v_$BUILD_NUMBER'
	                   
	                }
	                
	            }
		    
	        stage('docker image Scan') {
      		    steps {
        		sh 'trivy image 209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/myapp:v_$BUILD_NUMBER --no-progress'  //--exit-code 1 --severity CRITICAL '
      				}
    			}
	        
	        stage('create new deployment yaml file'){
	            steps{  
	                script {
	                    sh "sed -i -e 's#${oldImage_TAG}#${IMAGE_TAG}#' ./deployment.yaml"
	                    //sh "jq -r '.containerDefinitions[0].image |= [\\\"$IMAGE_TAG\\\"]' td_ecs.json > new_td-ecs.json"
	                  
	                }
	            }
	        }
	        
	        stage('docker push'){
	            steps{
	                withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){
	                    sh 'docker push --all-tags 209665464430.dkr.ecr.ap-southeast-2.amazonaws.com/myapp'
	                }
	              
	            }
	        }                   
	                         
	        stage('eks update-kubeconfig'){
	            steps {
	                withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){
	                    sh 'aws eks --region ap-southeast-2 update-kubeconfig --name junglemeetApp'}
	            }
	        }
	        
	        stage('eks deployment update'){
	            steps{
	                withAWS(credentials: AWS_CRED, region: 'ap-southeast-2'){                    
	                    sh 'kubectl apply -f deployment.yaml'	                   
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
