[![Build Status](https://travis-ci.org/joonne/tv-api.svg?branch=master)](https://travis-ci.org/joonne/tv-api)

# TV-API
tv-information scraper / API

`GET /api/channels`

Return all available channels from the database.

`POST /api/channels`

Creates a new channel into the database.

Response 201

```
{
    message: 'Created'
}
```
Response 409

```
{
    message: 'Channel <channel> already exists'
}
```

`DELETE /api/channels`

Deletes a channel from the database.

Response 200

```
{
    message: 'Deleted'
}
```
Response 404

```
{
    message: 'Not Found'
}
```

`GET /api/channels`

Return all available channels from the database.

`GET /api/programs/:channel`

Returns an array of today's programs for the given channel.

If there are no programs or the channel is incorrect / missing, empty array will be returned.
