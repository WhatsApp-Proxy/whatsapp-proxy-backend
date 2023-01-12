# WhatsApp Proxy Backend

WhatsApp Proxy Backend | Keeps track of all the proxy servers

## Routes

- GET: `/server` - Returns a 200 OK response, list with all registered servers
- GET: `/server/:id` - Returns a 200 OK response, more info about a server
- POST: `/server/register`- Data:

```json
{
	 "ipAddress": "IP",
  "proxyPort": port,
  "discoveryPort": DiscoveryServerPort,
  "serverName": "Name",
  "country": "Country Code",
  "key": "Your discovery key (from .env or custom key)"
}
```

- POST: `/key/register` - Data:

```json
{
	"masterKey": "MASTER KEY from .env",
	"key": "NEW KEY",
	"maxUsages": Max Usages,
	"serverNamePrefix": "PREFIX, nullable",
	"isActive": true
}
```

## How to run

- Copy `.env.example` to `.env`
- Fill in the required values
- Configure the port in the `docker-compose.yml` file if needed. (If you want to run the server on port 90 for example use the following value: `90:8080`)
- Run `docker-compose up -d` to start the server

## Migrations

- Run `yarn migrate` to run migrations
