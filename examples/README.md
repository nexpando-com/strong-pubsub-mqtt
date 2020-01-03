# Setup MQTT cluster

**For development purpose only**

- Use `docker-compose.yml` to setup a cluster with 3 `MQTT` instances based on `vernemq`
- `haproxy` enables traffic balancing among those instances
- Client might connect to the cluster via `mqtt` or `websocket` protocol


