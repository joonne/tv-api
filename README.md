[![Build Status](https://travis-ci.org/joonne/tv-api.svg?branch=master)](https://travis-ci.org/joonne/tv-api)

# TV-API

A web scraper that searches programs for finnish tv-channels and provides an API for this information.

`GET /api/channels`

Return all available channels from the database.

Response 200

```
["yle1", "yle2", "mtv3", "nelonen", "subtv", "liv", "jim", "viisi", "kutonen", "fox", "ava", "hero"]
```

`POST /api/channels`

Creates a new channel into the database.

Response 201

```
{
    message: "Created"
}
```
Response 409

```
{
    message: "Channel <channel> already exists"
}
```

`DELETE /api/channels`

Deletes a channel from the database.

Response 200

```
{
    message: "Deleted"
}
```
Response 404

```
{
    message: "Not Found"
}
```

`GET /api/programs`

Return all available programs from the database.

`GET /api/programs/:channel`

Returns an array of today's programs for the given channel.

If there are no programs or the channel is incorrect / missing, empty array will be returned.

Response 200

```
[
  {
    "channelName": "mtv3",
    "_id": "5813d16d19038efd763a1d19",
    "__v": 0,
    "data": {
      "end": "2016-10-29T00:50:00-04:00",
      "start": "2016-10-29T00:40:00-04:00",
      "episode": "-",
      "season": "-",
      "description": "Ei kuvausta saatavilla.",
      "name": "Eurojackpot, Jokeri ja Lomatonni"
    },
    "createdAt": "2016-10-28T22:30:05.983Z"
  },
  {
    "channelName": "mtv3",
    "_id": "5813d16e19038efd763a1d1a",
    "__v": 0,
    "data": {
      "end": "2016-10-29T01:45:00-04:00",
      "start": "2016-10-29T00:50:00-04:00",
      "episode": "5",
      "season": "1",
      "description": "Jaakko Heinimäki. Kausi 1, 5/10. Uusinta.",
      "name": "Pitääkö olla huolissaan?"
    },
    "createdAt": "2016-10-28T22:30:06.001Z"
  }
]
```
