[![Build Status](https://travis-ci.org/joonne/tv-api.svg?branch=master)](https://travis-ci.org/joonne/tv-api)

# TV-API
tv-information scraper / API

`GET /api/channels`

Return all programs from the database.

`GET /api/channels/:channel`

Returns an array of today's programs for the given channel.

If there are no programs or the channel is incorrect / missing, empty array will be returned.
