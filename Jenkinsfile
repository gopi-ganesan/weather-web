pipeline {
    agent { label 'dev' }

    environment {
        AWS_ACCOUNT_ID = "562404438689"
        AWS_REGION = "us-east-1"
        ECR_REPOS_NAME = "weather-web"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECS_CLUSTER_NAME = "weather-app-cl"
        ECS_SERVICE_NAME = "weather-app-se"
        IMAGE_TAG = "E5"
        LOCAL_IMAGE_NAME = "weather-web"   
    }

    stages {

        stage('Clone Repository') {
            steps {
                git(
                    url: 'https://github.com/gopi-ganesan/weather-web.git',
                    branch: 'main',
                    credentialsId: 'github-token'
                )
            }
        }

        stage('ECR Login') {
            steps {
                echo ' Logging in to ECR...'
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws'
                ]]) {
                    sh '''
                    aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    '''
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                echo ' Building Docker images using docker-compose...'
                sh '''
                docker-compose -f docker-compose.yml build
                '''
            }
        }

        stage('Tag & Push Docker Image to ECR') {
            steps {
                script {
                    echo ' Tagging & pushing image to ECR...'

                    sh """
                    docker tag ${LOCAL_IMAGE_NAME}:latest ${ECR_REGISTRY}/${ECR_REPOS_NAME}:${IMAGE_TAG}
                    docker push ${ECR_REGISTRY}/${ECR_REPOS_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                echo ' Deploying new version to ECS...'
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws'
                ]]) {
                    sh '''
                    aws ecs update-service \
                        --cluster ${ECS_CLUSTER_NAME} \
                        --service ${ECS_SERVICE_NAME} \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                    '''
                }
            }
        }
    }

    post {
        always { echo ' Pipeline completed' }
        success { echo ' Deployment successful!' }
        failure { echo ' Pipeline failed — check logs.' }
    }
}
