### What to change when running on docker

 - In queues modules change pika host server from `localhost` to `rabbitmq`
 - In websocket authentication modules change hosting server from `127.0.0.1` or `localhost` to `0.0.0.0`
 - In mainserver queue module change `amqp://localhost` to `amqp://rabbitmq`

