pipeline {
  agent none

  stages {
    stage('Build') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.58.0-noble'
          args '--network=host'
        }
      }
      steps {
        sh 'npm ci || npm install'
        sh 'npm run build'
      }
    }

    stage('Test') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.58.0-noble'
          args '--network=host'
        }
      }
      steps {
        sh 'npm run test'
        sh 'npm run test:e2e'
      }
      post {
        always {
          publishHTML([
            allowMissing: true,
            alwaysLinkToLastBuild: false,
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

    stage('Deploy Netlify (master/main only)') {
      when {
        branch 'main'
      }

      environment {
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
      }

      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.58.0-noble'
          args '--network=host'
        }
      }

      steps {
        // déploie le résultat du build Vite (dist/)
        sh 'node_modules/netlify-cli/bin/run.js deploy --prod --dir dist --site https://chessmohamedazizbraham.netlify.app/'
      }
    }
  }
}
