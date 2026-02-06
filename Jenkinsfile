pipeline {
    agent none
    stages {
        stage('Build') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.58.0-noble' } }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            agent { docker { image 'mcr.microsoft.com/playwright:v1.58.0-noble' } }
            steps {
                sh 'npm run test'
                sh 'npm run test:e2e'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: true,
                        reportDir: 'html',
                        reportFiles: 'index.html',
                        reportName: 'VitestReport',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'PlaywrightReport',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }
    }
}