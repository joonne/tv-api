[![Build Status](https://travis-ci.org/joonne/tv-api.svg?branch=master)](https://travis-ci.org/joonne/tv-api)

# TV-API

A web service that gets tv-channel information from xmltv.se and provides an API for this information.

`GET /api/channels`

Return all available channels from the database.

Can be filtered with query parameter `country` .

Example: GET /api/channels?country=fi

Response 200

```
[
  {
    name: "Folketinget",
    icon: "http://chanlogos.xmltv.se/ft.dk.png",
    _id: "ft.dk",
    country: "dk"
  },
  {
    name: "VOX (DE)",
    icon: "http://chanlogos.xmltv.se/vox.de.png",
    _id: "vox.de",
    country: "de"
  }
]
```

`PUT /api/channels/:channel`

Allows to modify the orderNumber of the channel.

Response 200

```
{
    message: "Modified"
}
```

`GET /api/channels/:channel/programs`

Returns an array of today's programs for the given channel.

If there are no programs or the channel is incorrect / missing, empty array will be returned.

Response 200

```
[
  {
    "channelName": "mtv3",
    "data": {
      "end": "2016-10-29T00:50:00-04:00",
      "start": "2016-10-29T00:40:00-04:00",
      "episode": "-",
      "season": "-",
      "description": "Ei kuvausta saatavilla.",
      "name": "Eurojackpot, Jokeri ja Lomatonni"
    }
  },
  {
    "channelName": "mtv3",
    "data": {
      "end": "2016-10-29T01:45:00-04:00",
      "start": "2016-10-29T00:50:00-04:00",
      "episode": "5",
      "season": "1",
      "description": "Jaakko Heinimäki. Kausi 1, 5/10. Uusinta.",
      "name": "Pitääkö olla huolissaan?"
    }
  }
]
```
`GET /api/countries`

Returns an array of available countries to perform filtering with.

Response 200

```
[
  "fi",
  "se",
  "de"
]
```