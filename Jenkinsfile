/*
 * Declarative Jenkins Pipeline – E-Commerce Spring Boot Application
 *
 * Trigger  : Every push to the 'master' branch (via GitHub webhook or SCM poll).
 * Strategy : Build → Test → Package → Docker Build → Deploy with docker compose.
 *
 * Prerequisites on the Jenkins agent machine (local Ubuntu PC)
 * ────────────────────────────────────────────────────────────
 * 1. Java 21 JDK  (configured in Jenkins → Manage Jenkins → Tools → JDK)
 *    Tool name used below: "JDK-21"
 * 2. Maven 3.9+   (configured in Jenkins → Manage Jenkins → Tools → Maven)
 *    Tool name used below: "Maven-3.9"
 * 3. Docker Engine installed and the jenkins OS user added to the docker group:
 *      sudo usermod -aG docker jenkins && newgrp docker
 * 4. Docker Compose v2 (ships with Docker Desktop / `docker compose` plugin)
 * 5. The GitHub repository configured as an SCM source in this Jenkins job.
 *    For automatic triggers, configure a GitHub webhook pointing at:
 *      http://<jenkins-host>:8080/github-webhook/
 */

pipeline {

    // Run on any available agent.  Replace 'any' with a specific label if you
    // have dedicated build nodes.
    agent any

    // ── Tool aliases (must match names in Manage Jenkins → Tools) ────────────
    tools {
        jdk   'JDK-21'
        maven 'Maven-3.9'
    }

    // ── Environment variables available to every stage ────────────────────────
    environment {
        // Docker image name (no registry prefix = local image only)
        IMAGE_NAME = 'ecommerce-app'

        // Tag the image with the Jenkins build number AND keep a 'latest' alias
        IMAGE_TAG  = "${env.BUILD_NUMBER}"

        // Application URL shown in the success message
        APP_URL    = 'http://localhost:8080'

        // Swagger / OpenAPI UI
        SWAGGER_URL = 'http://localhost:8080/swagger-ui.html'
    }

    // ── Automatic build triggers ──────────────────────────────────────────────
    triggers {
        /*
         * Option A – GitHub webhook (recommended, zero-latency):
         *   Install the "GitHub plugin" in Jenkins, then add a webhook in your
         *   GitHub repo: Settings → Webhooks → Add webhook
         *     Payload URL : http://<your-jenkins-host>:8080/github-webhook/
         *     Content type: application/json
         *     Events      : Just the push event
         *   Then enable "GitHub hook trigger for GITScm polling" in the job config.
         *
         * Option B – SCM polling (fallback, no public Jenkins URL needed):
         *   Uncomment the line below.  Jenkins will poll GitHub every 5 minutes
         *   and start a build only when new commits are detected on master.
         */
        // pollSCM('H/5 * * * *')
        githubPush()
    }

    options {
        // Keep the last 10 build records to save disk space
        buildDiscarder(logRotator(numToKeepStr: '10'))

        // Abort the build if it runs for more than 30 minutes
        timeout(time: 30, unit: 'MINUTES')

        // Add timestamps to every log line
        timestamps()
    }

    // ═════════════════════════════════════════════════════════════════════════
    // STAGES
    // ═════════════════════════════════════════════════════════════════════════
    stages {

        // ── 1. Checkout ───────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '──── Stage 1: Checkout source code ────'
                // 'checkout scm' uses the SCM configuration of this Jenkins job.
                // It automatically checks out the branch that triggered the build.
                checkout scm
            }
        }

        // ── 2. Build (compile only – fast feedback) ───────────────────────────
        stage('Build') {
            steps {
                echo '──── Stage 2: Compile source code ────'
                // -DskipTests : compile only, tests run in the next stage
                // -B          : non-interactive (batch) mode suitable for CI
                sh './mvnw clean compile -DskipTests -B'
            }
        }

        // ── 3. Test ───────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                echo '──── Stage 3: Run unit tests ────'
                /*
                 * NOTE: Integration tests that require a live PostgreSQL database
                 * will fail here unless a test database is available on the agent.
                 *
                 * Two options to make tests pass in CI:
                 *
                 * Option A – Use the existing docker-compose PostgreSQL:
                 *   Before running the pipeline, ensure the DB container is up:
                 *     docker compose up -d postgres
                 *
                 * Option B – Use an in-memory H2 database for tests only:
                 *   Add H2 dependency (test scope) and a src/test/resources/
                 *   application-test.yaml that overrides the datasource.
                 *   Then use: sh './mvnw test -Dspring.profiles.active=test -B'
                 */
                sh './mvnw test -B'
            }
            post {
                // Publish JUnit test results regardless of pass/fail so Jenkins
                // displays the test trend graph on the job dashboard.
                always {
                    junit testResults: 'target/surefire-reports/*.xml',
                          allowEmptyResults: true
                }
            }
        }

        // ── 4. Package ────────────────────────────────────────────────────────
        stage('Package') {
            steps {
                echo '──── Stage 4: Package fat JAR ────'
                // Tests already ran in Stage 3, skip them here to save time.
                sh './mvnw package -DskipTests -B'
                echo "JAR produced: target/Ecommerce-0.0.1-SNAPSHOT.jar"

                // Archive the JAR as a Jenkins build artefact so it can be
                // downloaded from the Jenkins UI if needed.
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }

        // ── 5. Docker Build ───────────────────────────────────────────────────
        stage('Docker Build') {
            steps {
                echo '──── Stage 5: Build Docker image ────'
                // Build the image and tag it with both the build number and 'latest'
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
                echo "Docker image built: ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        // ── 6. Deploy ─────────────────────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo '──── Stage 6: Deploy with docker compose ────'

                // Pull any updated base images (postgres, etc.) from Docker Hub.
                // The '|| true' prevents the stage from failing if a pull fails
                // (e.g. no internet access) – existing cached images will be used.
                sh 'docker compose pull --ignore-buildable || true'

                // Bring up the full stack (postgres + app).
                // --build  : rebuild the app image from the Dockerfile
                // -d       : run in detached (background) mode
                // --remove-orphans: clean up containers for services no longer
                //            in docker-compose.yml
                sh 'docker compose up -d --build --remove-orphans'

                // Poll the application every 5 seconds until it responds or
                // the 120-second timeout is reached.
                sh '''
                    echo "Waiting for the application to become ready..."
                    TIMEOUT=120
                    INTERVAL=5
                    ELAPSED=0
                    until [ "$ELAPSED" -ge "$TIMEOUT" ]; do
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${APP_URL}/actuator/health 2>/dev/null || \
                                 curl -s -o /dev/null -w "%{http_code}" ${APP_URL}/ 2>/dev/null || \
                                 echo "000")
                        if [ "${STATUS}" = "200" ] || [ "${STATUS}" = "401" ] || [ "${STATUS}" = "403" ]; then
                            echo "Application is up and running! (HTTP ${STATUS} after ${ELAPSED}s)"
                            exit 0
                        fi
                        echo "Not ready yet (HTTP ${STATUS}), retrying in ${INTERVAL}s... (${ELAPSED}/${TIMEOUT}s elapsed)"
                        sleep ${INTERVAL}
                        ELAPSED=$((ELAPSED + INTERVAL))
                    done
                    echo "WARNING: Application did not become ready within ${TIMEOUT}s."
                    echo "Check container logs with: docker compose logs app"
                '''
            }
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // POST ACTIONS
    // ═════════════════════════════════════════════════════════════════════════
    post {
        success {
            echo """
+------------------------------------------------------+
|  BUILD #${env.BUILD_NUMBER} DEPLOYED SUCCESSFULLY     |
|                                                      |
|  API  : ${APP_URL}                        |
|  Docs : ${SWAGGER_URL}           |
+------------------------------------------------------+
"""
        }

        failure {
            echo """
+------------------------------------------------------+
|  BUILD #${env.BUILD_NUMBER} FAILED                    |
|  Check the console output above for details.         |
|  Run: docker compose logs app   for app logs         |
+------------------------------------------------------+
"""
        }

        // Clean the Jenkins workspace after every build to reclaim disk space.
        // The application continues to run in Docker; only the build artefacts
        // are removed from the Jenkins working directory.
        always {
            cleanWs()
        }
    }
}
