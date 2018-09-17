# Indeed Remote Angular Jobs RSS

This is a [RSS feed](https://en.wikipedia.org/wiki/RSS) that lists remote jobs in the Angular ecosystem ([Angular 2+](https://angular.io/), [Ionic](https://ionicframework.com/), [NativeScript](https://www.nativescript.org/)) from all [Indeed](https://www.indeed.com/) websites.

## Juiciest bits

You can find the most interesting stuff at [`src/rss.js`](src/rss.js).

## How to run locally

1. Install [Node.js](https://nodejs.org/en/)
2. Clone or fork this repository
3. Run the command `npm install` on the repository folder
4. Run the command `INDEED_PUBLISHER_ID=xxx npm run serve` (replace `xxx` with your [Indeed Publisher ID](https://www.indeed.com/publisher))
5. Open [http://localhost:9000/rss](http://localhost:9000/rss) in your browser

## Tech stack

[Node.js](https://nodejs.org/en/), [node-fetch](https://github.com/bitinn/node-fetch), [node-rss](https://github.com/dylang/node-rss), and [netlify-lambda](https://github.com/netlify/netlify-lambda).
