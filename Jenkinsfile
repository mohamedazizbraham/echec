pipeline {
  agent none

  options {
    timestamps()
  }

  stages {

    stage('CI (Install / Build / Tests)') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.58.0-noble'
          args '--network=host'
        }
      }

      steps {
        sh 'node -v'
        sh 'npm -v'
        sh 'npm ci || npm install'

        sh 'npm run build'
        sh 'npm run test'
        sh 'npm run test:e2e'
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

    stage('Docker build & push (main only)') {
      agent any
      when { branch 'main' }

      environment {
        CI_REGISTRY = 'ghcr.io'
        CI_REGISTRY_USER = 'mohamedazizbraham'
        CI_REGISTRY_IMAGE = "${CI_REGISTRY}/${CI_REGISTRY_USER}/chess:latest"
        CI_REGISTRY_PASSWORD = credentials('CI_REGISTRY_PASSWORD')
      }

      steps {
        // Sécurise le fait qu'on a bien le code dans ce workspace
        checkout scm

        sh 'docker version'
        sh 'docker build -f Dockerfile --network=host -t $CI_REGISTRY_IMAGE .'
        sh 'echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY'
        sh 'docker push $CI_REGISTRY_IMAGE'
      }
    }

    stage('Deploy Netlify (main/master only)') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.58.0-noble'
          args '--network=host'
        }
      }

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
        // pour être sûr d'avoir dist/
        sh 'npm ci || npm install'
        sh 'npm run build'

        sh 'node_modules/netlify-cli/bin/run.js deploy --prod --dir dist --site 349484c7-c4be-484b-9277-9c8a96ed7934'
      }
    }
  }
}
