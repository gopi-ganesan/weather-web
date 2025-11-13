pipeline {
    agent { label 'dev' }

    environment {
        AWS_ACCOUNT_ID = "562404438689"
        AWS_REGION = "us-east-1"
        ECR_REPOS_NAME = "weather-app-repo"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECS_CLUSTER_NAME = "weather-app-cluster"
        ECS_SERVICE_NAME = "weather-app-service"
        IMAGE_TAG = "E2"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git(
                    url: 'https://github.com/gopi-ganesan/weather-app.git',
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
                    #!/bin/bash
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    '''
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                echo ' Building Docker images using docker-compose...'
                sh '''
                #!/bin/bash
                docker-compose -f docker-compose.yml build
                '''
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                echo ' Pushing Docker image to ECR...'
                sh '''
                #!/bin/bash
                docker tag weather-app:${IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPOS_NAME}:${IMAGE_TAG}
                docker push ${ECR_REGISTRY}/${ECR_REPOS_NAME}:${IMAGE_TAG}
                '''
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
                    #!/bin/bash
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
        always {
            echo ' Pipeline completed'
        }
        success {
            echo ' Deployment successful!'
        }
        failure {
            echo ' Pipeline failed — check the logs for details.'
        }
    }
}
