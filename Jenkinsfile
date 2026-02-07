pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.58.0-noble'
      args '--network=host'
    }
  }

  stages {
    stage('Install') {
      steps {
        sh 'node -v'
        sh 'npm -v'
        sh 'npm ci || npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Unit tests (Vitest)') {
      steps {
        sh 'npm run test'
      }
    }

    stage('UI tests (Playwright)') {
      steps {
        sh 'npm run test:e2e'
      }
    }

    stage('Deploy Netlify (main/master only)') {
      when {
        anyOf {
          branch 'main'
          branch 'master'
        }
      }
      environment {
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
      }
      steps {
        sh 'node_modules/netlify-cli/bin/run.js deploy --prod --dir dist --site 349484c7-c4be-484b-9277-9c8a96ed7934'
      }
    }
  }

  post {
    always {
      // Vitest report
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

      // Playwright report
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
