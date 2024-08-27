# API

- [API](#api)
  - [GracefulServer](#gracefulserver)
  - [IGracefulServerOptions](#igracefulserveroptions)
  - [GracefulServer Instance](#gracefulserver-instance)


## GracefulServer

```typescript
;((server: http.Server, options?: IGracefulServerOptions | undefined) => IGracefulServer) & typeof State
```

where `State` is an enum that contains, `STARTING`, `READY`, `SHUTTING_DOWN` and `SHUTDOWN`.

## IGracefulServerOptions

All of the below options are optional.

| Name              |            Type            | Default |                                                      Description |
| ----------------- | :------------------------: | :-----: | ---------------------------------------------------------------: |
| syncClose         |          boolean           |  false  |                               Run the closePromises in a series. |
| closePromises     | (() => Promise<unknown>)[] |   []    |                    The functions to run when the API is stopping |
| timeout           |           number           |  1000   | The time in milliseconds to wait before shutting down the server |
| healthCheck       |          boolean           |  true   |    Enable/Disable the default endpoints (liveness and readiness) |
| kubernetes        |          boolean           |  false  |                               Enable/Disable the kubernetes mode |
| livenessEndpoint  |           string           |  /live  |                                            The liveness endpoint |
| readinessEndpoint |           string           | /ready  |                                           The readiness endpoint |

If you use Kubernetes, enable the kubernetes mode to let it handles the incoming traffic of your application.

The Kubernetes mode will only work if you haven't disabled the health checks.

## GracefulServer Instance

```typescript
export default interface IGracefulServer {
  isReady: () => boolean
  setReady: () => void
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter
}
```
