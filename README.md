#WAKNews

This is a (relatively) simple script for assembling and typesetting the WAKNews,
the daily newsletter of Camp Wakpominee. It relies on Prince, an HTML-to-PDF
layout engine.

## Installation

```
git clone https://github.com/seangllghr/WAKNews.git
cd WAKNews
npm install
npm link
```

## Usage

```
waknews <path/to/feature/article.[txt,md]> <path/to/events/list.json>
```

## Features

The script is basic and hacky, but it gets the job done. Currently, the
stylesheet and image resources are hard-coded in; in theory, it may be desirable
to add user-specified stylesheets.

The articles are written in Markdown, and should begin with a first-level (\#)
or third-level (\###) heading:

```
# This is an article

The paragraphs are boring
```

Coming events lists are written in JSON, and take the form of a single array of
2-element arrays, each containing an event title and event detail:

```
[
  ["Event Title", "Event Detail"],
  ["Event Title", "Event Detail"]
]
```
