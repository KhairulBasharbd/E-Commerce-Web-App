# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 – Build
# Use the official Maven image that bundles JDK 21 to compile the project and
# produce the executable JAR.  Nothing from this stage ships in the final image.
# ─────────────────────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy dependency descriptors first so Docker can cache the dependency layer.
# The layer is only invalidated when pom.xml actually changes.
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
RUN chmod +x mvnw

# Download all dependencies (offline-friendly cache layer)
RUN ./mvnw dependency:go-offline -B

# Copy source and build the fat JAR, skipping tests because tests are run as a
# dedicated Jenkins stage that can capture reports separately.
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 – Runtime
# Use a slim JRE-only image to keep the final image as small as possible.
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create a non-root user for security best-practice
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only the fat JAR produced in the build stage
COPY --from=build /workspace/target/Ecommerce-0.0.1-SNAPSHOT.jar app.jar

# Switch to non-root user
USER appuser

# Expose the port the Spring Boot application listens on
EXPOSE 8080

# JVM tuning flags:
#   -XX:+UseContainerSupport   – honour cgroup memory/CPU limits
#   -XX:MaxRAMPercentage=75.0  – use at most 75 % of the container's RAM for the heap
ENTRYPOINT ["java", \
            "-XX:+UseContainerSupport", \
            "-XX:MaxRAMPercentage=75.0", \
            "-jar", "app.jar"]
