pipeline{
    agent any
    stages{

        stage("Cloning git"){
            steps{
            
               git branch: 'main', credentialsId: 'git', url: 'https://github.com/susrutap/POC.git'
        }
        }      
        stage("Docker Build"){
            steps{
                sh "docker build -t k2sujith/live-score:latest ."  
        }
        }
        stage("Docker Push"){
            steps{
                withCredentials([string(credentialsId: 'DockerPass', variable: 'dockerPass')]) {
                    sh "docker login -u k2sujith -p ${DockerPass}"
                    sh "docker push k2sujith/live-score:latest"
            }
            }     
        }
        stage("k8s deployment"){
            steps{
                sshagent(['5049f3e4-d559-48f6-9310-c442005d2157']) {
                    sh "scp -o StrictHostKeyChecking=no live-score-service.yaml live-score-deployment.yaml ec2-user@18.196.116.134:/home/ec2-user/"
                    script{
                        try{
                            sh "ssh ec2-user@18.196.116.134 kubectl apply -f ."
                        }catch(error){
                            sh "ssh ec2-user@18.196.116.134 kubectl apply -f ."
                    }
                    }
                }
            }
        }
}
}
