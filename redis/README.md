# docker-redis

This repository contains the Dockerfile for Lita.io's public Redis image: [litaio/redis](https://hub.docker.com/r/litaio/redis/)

## Configuration

The default Redis configuration is the default configuration with one minor changes:

* The data directory is set to /var/lib/redis.

You can provide your own custom configuration by mounting a volume with another file. The details of this are shown below.

## Usage

For default settings, run:

``` bash
docker run --name redis litaio/redis
```

This will require that other containers that need to access redis do so using Docker's linking feature:

``` bash
docker run --link redis:redis my_company/my_application
```

Use the `-p` or `-P` flags if you need to expose Redis on a host port.

It's recommended to run the container with a host volume bound for persistent data storage:

``` bash
docker run -v /path/to/redis/data/on/host:/var/lib/redis --name redis litaio/redis
```

The mount path inside the container must be /var/lib/redis, unless you override Redis's "dir" setting in your own configuration file.

To run Redis with a custom configuration file:

``` bash
docker run -v /path/to/custom/redis.conf:/etc/redis.conf --name redis litaio/redis
```

The path inside the container must be /etc/redis.conf if you use the default Docker command.

## License

[MIT](http://opensource.org/licenses/MIT)
