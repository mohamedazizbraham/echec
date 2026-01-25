pipeline {
  agent none

  stages {
    stage('Install') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
      steps {
        sh 'node -v'
        sh 'npm -v'
        // mieux que npm install en CI si package-lock.json existe
        sh 'npm ci || npm install'
      }
      post {
        always {
          // Publie le rapport Vitest (html/index.html)
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

          // Publie le rapport Playwright (playwright-report/index.html)
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

    stage('Build') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
      steps {
        sh 'npm run build'
      }
    }

    stage('Unit tests (Vitest)') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
      steps {
        sh 'npm run test'
      }
    }

    stage('UI tests (Playwright)') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.57.0-noble' } }
      steps {
        sh 'npm run test:e2e'
      }
    }
  }

  post {
    always {
      // Au cas où un stage échoue avant d'atteindre le post de Install,
      // on republie aussi ici (allowMissing=true évite de faire échouer).
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
