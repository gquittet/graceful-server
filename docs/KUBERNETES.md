# Integration with Kubernetes

Don't forget to enable the kubernetes mode. [Check here](#igracefulserveroptions) (related to this [issue](https://github.com/gquittet/graceful-server/issues/5))

```yml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  failureThreshold: 1
  initialDelaySeconds: 5
  periodSeconds: 5
  successThreshold: 1
  timeoutSeconds: 5
livenessProbe:
  httpGet:
    path: /live
    port: 8080
  failureThreshold: 3
  initialDelaySeconds: 10
  # Allow sufficient amount of time (90 seconds = periodSeconds * failureThreshold)
  # for the registered shutdown handlers to run to completion.
  periodSeconds: 30
  successThreshold: 1
  # Setting a very low timeout value (e.g. 1 second) can cause false-positive
  # checks and service interruption.
  timeoutSeconds: 5

# As per Kubernetes documentation (https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe),
# startup probe should point to the same endpoint as the liveness probe.
#
# Startup probe is only needed when container is taking longer to start than
# `initialDelaySeconds + failureThreshold × periodSeconds` of the liveness probe.
startupProbe:
  httpGet:
    path: /live
    port: 8080
  failureThreshold: 3
  initialDelaySeconds: 10
  periodSeconds: 30
  successThreshold: 1
  timeoutSeconds: 5
```
