pieline{
    agent {
        label 'dev'
    }
        environment{
            aws_account_id="562404438689"
            aws_region="us-east-1"
            ecr_repos_name="weather-app-repo"
            ecr_registry="${aws_account_id}.dkr.ecr.${aws_region}.amazonaws.com"
            ecs_cluster_name="weather-app-cluster"
            ecs_service_name="weather-app-service"
            images_Tag="E1"
            
        }

    stages{
        stage('colone repo'){
            steps{
                git(
                    url:'',
                    branch:'',
                    credentialsID:'github-token',
                )
            }
        }

        stage('ECR login'){
            steps{
                echo'the ecr login staet'
                withCredentials([[$class:'AmazonWebServicesCredentialsBinding',
                credentialsId:'aws-credentials']]){
                    sh'''
                    aws ecr get-login-password --region ${aws_region} | \
                     docker login --username AWS --password-stdin ${ecr_registry}
                    ''' 
                }
            }
        }

        stage('build docker compose'){
            steps{
                echo 'build docker image'
                sh'''
                docker-compose -f docker-compose.yml build
                '''
            }
        }

        stage('push docker image to ecr'){
            steps{
                echo 'push docker image to ecr'
                sh '''
                docker tag weather-app:e1 ${ecr_registry}/${ecr_repos_name}:${images_Tag}
                docker push ${ecr_registry}/${ecr_repos_name}:${images_Tag}
                '''
            }
        }

        stage('deploy to ecs'){
            steps{
                echo 'deploy to ecs'
                sh '''
                aws ecs update-service \
                --cluster ${ecs_cluster_name} \
                --service ${ecs_service_name} \
                --force-new-deployment \
                --region ${aws_region}
                '''
            }
        }
    }

    post{
        always{
            echo 'pipeline completed'
        }

        success{
            echo 'pipeline seccessful'
        }

        failure{
            echo 'pipeline failed'
        }
    }
}