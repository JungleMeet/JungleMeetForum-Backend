pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="026376606405"
        AWS_DEFAULT_REGION="us-east-1" 
        IMAGE_REPO_NAME="jm_backend"
        IMAGE_TAG= sh(returnStdout: true, script: "git rev-parse --short=5 HEAD").trim()
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
        SERVICE_NAME = 'junglemeet-service-dev'
        TASK_FAMILY="junglemeet-task-dev" 
        TASKDEF_NAME = "junglemeet-container-dev"
        DESIRED_COUNT="2"
        CLUSTER_NAME = "junglemeet-cluster-dev"
        EXECUTION_ROLE_ARN = "arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole"
        AWS_ECS_TASK_DEFINITION_PATH = 'file://taskdef_template.json'
        MONGO_URI = "${env.MONGO_URI}"
        TMDB_KEY = "${env.TMDB_KEY}"
        JWT_SECRET = "${env.JWT_SECRET}"
        JWT_EXPIRE_TIME = "${env.JWT_EXPIRE_TIME}"
    }
    options {
        ansiColor('xterm')
        timestamps()
        timeout(time: 150, unit: "MINUTES")
    }
    stages {
        //login to ecr
        stage('Logging into AWS ECR') {
            steps {
                withAWS(credentials: 'AWS_Credentials', region: 'us-east-1') {
                    script {
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    }
                }
                 
            }
        }

        stage('Cloning Git') {
            steps {
                withAWS(credentials: 'AWS_Credentials', region: 'us-east-1') {
                    checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/aaron027/JungleMeetForum-Backend.git']]])     
                }
            }
        }
        
//         stage('Sonarqube') {
//             environment {
//                 scannerHome = tool 'Sonarqube_scanner'
//             }
//             steps {
//                 withSonarQubeEnv('sonarqube_7.9.6') {
//                    // sh "${scannerHome}/bin/sonar-scanner"
//                    sh '''
//                    sonar-scanner \
//                       -Dsonar.projectKey=junglemeet_backend \
//                       -Dsonar.sources=. \
//                       -Dsonar.host.url=http://54.206.106.18:9000 \
//                       -Dsonar.login=c693fbe9fdddeefafc46cb658cf2b28d4702231f
//                 '''
//                 }
                
//                 timeout(time: 10, unit: 'MINUTES') {
//                     waitForQualityGate abortPipeline: true
//                 }
//             }
//         }

    // Building Docker images
        stage('Building image') {
            steps{
                script {
                    withAWS(credentials: 'AWS_Credentials', region: 'us-east-1') {
                        sh '''
                             docker build --build-arg MONGO_URI_ARG=${MONGO_URI} --build-arg TMDB_KEY_ARG=${TMDB_KEY} --build-arg JWT_SECRET_ARG=${JWT_SECRET} --build-arg JWT_EXPIRE_TIME_ARG=${JWT_EXPIRE_TIME} -t "${IMAGE_REPO_NAME}:${IMAGE_TAG}" .
                        '''   
                    }
                }
            }
        }

    // Uploading Docker images into AWS ECR
         stage("Pushing to ECR") {
            steps{
                script {
                    withAWS(credentials: 'AWS_Credentials', region: 'us-east-1') {
                        sh "docker tag ${IMAGE_REPO_NAME}:${IMAGE_TAG} ${REPOSITORY_URI}:${IMAGE_TAG}"
                        sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                    }
                }
            }
         }

        stage('Deploy Image to EKS') {
            steps{
                // update service
                script {
                    withAWS(credentials: 'AWS_Credentials', region: 'us-east-1') {
                        def newimageurl = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                        def oldimageurl = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
                        sh "sed -i -e 's#${oldimageurl}#${newimageurl}#' ./manifest.yml"
                        sh "kubectl apply manifest.yml"
                    }
                }
            }
        }
      
    }
    post {
        always{
            echo 'I will always say Hello again! test for webhook'
            cleanWs()
        }
    }
    
}
