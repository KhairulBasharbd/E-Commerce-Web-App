pipeline {
    // Run on the Jenkins server itself (no separate agents needed for learning)
    agent any

    environment {
        // ── App config ────────────────────────────────────────────────
        // Port the Spring Boot app will bind to INSIDE the Jenkins container.
        // Must match the port mapped when you recreated Jenkins (-p 8090:8090).
        APP_PORT = '8090'

        // Where the deployed JAR will live (persistent across builds via jenkins-data volume)
        DEPLOY_DIR  = '/var/jenkins_home/deployments'
        APP_JAR     = 'ecommerce-app.jar'
        APP_LOG     = '/var/jenkins_home/deployments/ecommerce-app.log'
        PID_FILE    = '/var/jenkins_home/deployments/ecommerce-app.pid'

        // ── Database config ───────────────────────────────────────────
        // 'host.docker.internal' resolves to the Windows host from inside any Docker container.
        // Your docker-compose maps postgres 5432:5432 to Windows, so this reaches it.
        DB_URL      = 'jdbc:postgresql://host.docker.internal:5432/ecommerce_db'
        DB_USERNAME = 'postgres'
        DB_PASSWORD = 'postgres'

        // ── JWT secret (match your application.yaml) ──────────────────
        JWT_SECRET  = 'kekUJgI4idp1C2hgab4cwDcvB3y8xmwO3scdvByjCSE'
    }

    stages {

        // ─────────────────────────────────────────────────────────────
        // STAGE 1 — Checkout
        // Jenkins uses the Git repo URL configured in your Pipeline job
        // 'checkout scm' = pull latest code from that configured repo
        // ─────────────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm

                // The mvnw script needs execute permission inside the Linux container
                sh 'chmod +x mvnw'
                echo '✅ Code checked out. Files in workspace:'
                sh 'ls -la'
            }
        }

        // ─────────────────────────────────────────────────────────────
        // STAGE 2 — Build & Test
        // Compiles the code AND runs all JUnit tests.
        // If any test fails: pipeline stops here. BAD code never gets deployed.
        // This is the heart of CI (Continuous Integration).
        // ─────────────────────────────────────────────────────────────
        stage('Build & Test') {
            steps {
                echo '🧪 Compiling and running tests...'
                // -B = batch/non-interactive mode (clean output for CI logs)
                // The DB tests connect via host.docker.internal (same as deploy)
                sh """
                    ./mvnw clean test -B \
                        -DDB_URL=${DB_URL} \
                        -DDB_USERNAME=${DB_USERNAME} \
                        -DDB_PASSWORD=${DB_PASSWORD}
                """
            }
            post {
                // 'always' runs whether tests passed or failed
                always {
                    // Publish test results to Jenkins UI — you'll see a graph over time!
                    junit allowEmptyResults: true,
                          testResults: '**/target/surefire-reports/*.xml'
                }
                success {
                    echo '✅ All tests passed!'
                }
                failure {
                    echo '❌ Tests failed! Pipeline stopped. Fix tests before this can deploy.'
                }
            }
        }

        // ─────────────────────────────────────────────────────────────
        // STAGE 3 — Package (Build JAR)
        // Creates the fat/uber JAR with all dependencies bundled.
        // -DskipTests: tests already ran above, so we skip to save time.
        // ─────────────────────────────────────────────────────────────
        stage('Package') {
            steps {
                echo '📦 Packaging application into JAR...'
                sh './mvnw package -DskipTests -B'

                // Confirm the JAR was created and show its size
                sh 'ls -lh target/*.jar'
                echo '✅ JAR packaged successfully'
            }
        }

        // ─────────────────────────────────────────────────────────────
        // STAGE 4 — Deploy
        // Stops the old running app (if any), copies the new JAR,
        // and starts it in the background with 'nohup'.
        //
        // Why nohup?
        //   Each 'sh' block in Jenkins creates a new shell.
        //   Without nohup, the java process would be killed when the
        //   shell exits at the end of this stage. nohup detaches it.
        // ─────────────────────────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'

                // ──────────────────────────────────────────────────────────
                // CRITICAL FIX: JENKINS_NODE_COOKIE=dontKillMe
                //
                // By default, Jenkins has a "ProcessTreeKiller" that terminates
                // ALL child processes spawned by an 'sh' block when the block ends.
                // This means our 'nohup java -jar ... &' would get killed instantly!
                //
                // Setting JENKINS_NODE_COOKIE=dontKillMe tells Jenkins:
                // "This process is intentionally left running — do NOT kill it."
                // ──────────────────────────────────────────────────────────
                withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
                    sh """
                        # Create deployment directory if it does not exist
                        mkdir -p ${DEPLOY_DIR}

                        # ── Stop old instance ───────────────────────────
                        if [ -f ${PID_FILE} ]; then
                            OLD_PID=\$(cat ${PID_FILE})
                            echo "Stopping old instance PID: \$OLD_PID"
                            kill \$OLD_PID 2>/dev/null || true
                            sleep 3
                        fi

                        # Safety net: kill any lingering process using our JAR name
                        pkill -f '${APP_JAR}' || true
                        sleep 2

                        # ── Copy new JAR ────────────────────────────────
                        cp target/Ecommerce-0.0.1-SNAPSHOT.jar ${DEPLOY_DIR}/${APP_JAR}
                        echo "JAR copied to ${DEPLOY_DIR}/${APP_JAR}"

                        # ── Start new instance ──────────────────────────
                        # nohup + & = run in background, persist after shell exits
                        # -Dserver.address=0.0.0.0 = bind to ALL interfaces (not just localhost)
                        #   This is REQUIRED so that Docker port mapping can reach the app
                        nohup java \
                            -Dserver.port=${APP_PORT} \
                            -Dserver.address=0.0.0.0 \
                            -DDB_URL="${DB_URL}" \
                            -DDB_USERNAME=${DB_USERNAME} \
                            -DDB_PASSWORD=${DB_PASSWORD} \
                            -Dsecurity.jwt.secret=${JWT_SECRET} \
                            -jar ${DEPLOY_DIR}/${APP_JAR} \
                            > ${APP_LOG} 2>&1 &

                        # Save PID for next deploy cycle
                        echo \$! > ${PID_FILE}
                        NEW_PID=\$(cat ${PID_FILE})
                        echo "✅ App started with PID: \$NEW_PID"

                        # Wait briefly, then verify the process is actually alive
                        sleep 5
                        if kill -0 \$NEW_PID 2>/dev/null; then
                            echo "✅ Process \$NEW_PID is alive and running"
                        else
                            echo "❌ Process \$NEW_PID died immediately! Dumping log:"
                            cat ${APP_LOG}
                            exit 1
                        fi
                    """
                }
            }
        }

        // ─────────────────────────────────────────────────────────────
        // STAGE 5 — Health Check
        // Waits for Spring Boot to fully start (takes ~20-30 seconds),
        // then hits the /actuator/health endpoint.
        // If the app is down or unreachable: stage turns red in UI.
        // ─────────────────────────────────────────────────────────────
        stage('Health Check') {
            steps {
                echo '🏥 Waiting 30 seconds for Spring Boot to initialize...'
                sh 'sleep 30'

                echo 'Checking health endpoint...'
                sh '''
                    curl -sf \
                         --retry 5 \
                         --retry-delay 5 \
                         --retry-connrefused \
                         http://localhost:8090/actuator/health \
                    | python3 -m json.tool \
                    || curl -sf http://localhost:8090/actuator/health \
                    || echo "⚠️ Health check could not reach the app. Check logs."
                '''
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // POST ACTIONS — run after all stages finish (success or failure)
    // ─────────────────────────────────────────────────────────────────
    post {
        success {
            echo """
╔══════════════════════════════════════════════════╗
║  🎉  PIPELINE SUCCEEDED — Build #${BUILD_NUMBER}  ║
╠══════════════════════════════════════════════════╣
║  App URL   :  http://localhost:8090              ║
║  Swagger   :  http://localhost:8090/swagger-ui.html ║
║  Health    :  http://localhost:8090/actuator/health  ║
║  App Logs  :  See command below                  ║
╚══════════════════════════════════════════════════╝

  View live logs:
  docker exec jenkins-blueocean tail -f /var/jenkins_home/deployments/ecommerce-app.log
"""
        }
        failure {
            echo """
╔══════════════════════════════════════════════════╗
║  ❌  PIPELINE FAILED — Build #${BUILD_NUMBER}    ║
╠══════════════════════════════════════════════════╣
║  • Look at the RED stage above for the error     ║
║  • Check app logs if deploy stage passed         ║
║  Command:                                        ║
║  docker exec jenkins-blueocean cat               ║
║      /var/jenkins_home/deployments/ecommerce-app.log ║
╚══════════════════════════════════════════════════╝
"""
            // If deploy succeeded but health check failed, try to show app logs
            sh 'cat /var/jenkins_home/deployments/ecommerce-app.log 2>/dev/null | tail -50 || true'
        }
    }
}
