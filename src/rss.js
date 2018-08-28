import fetch from "node-fetch";
import RSS from "rss";

exports.handler = async function(event, context, callback) {
  // create an rss feed
  const feed = new RSS({
    title: "Indeed Remote Angular Jobs RSS",
    feed_url: "https://indeed-remote-angular-jobs.netlify.com/.netlify/functions/rss",
    site_url: "https://indeed-remote-angular-jobs.netlify.com"
  });

  // Indeed country list
  // https://ads.indeed.com/jobroll/xmlfeed
  const countries = {
    aq: "Antarctica",
    ar: "Argentina",
    au: "Australia",
    at: "Austria",
    bh: "Bahrain",
    be: "Belgium",
    br: "Brazil",
    ca: "Canada",
    cl: "Chile",
    cn: "China",
    co: "Colombia",
    cr: "Costa Rica",
    cz: "Czech Republic",
    dk: "Denmark",
    ec: "Ecuador",
    eg: "Egypt",
    fi: "Finland",
    fr: "France",
    de: "Germany",
    gr: "Greece",
    hk: "Hong Kong",
    hu: "Hungary",
    in: "India",
    id: "Indonesia",
    ie: "Ireland",
    il: "Israel",
    it: "Italy",
    jp: "Japan",
    kw: "Kuwait",
    lu: "Luxembourg",
    my: "Malaysia",
    mx: "Mexico",
    ma: "Morocco",
    nl: "Netherlands",
    nz: "New Zealand",
    ng: "Nigeria",
    no: "Norway",
    om: "Oman",
    pk: "Pakistan",
    pa: "Panama",
    pe: "Peru",
    ph: "Philippines",
    pl: "Poland",
    pt: "Portugal",
    qa: "Qatar",
    ro: "Romania",
    ru: "Russia",
    sa: "Saudi Arabia",
    sg: "Singapore",
    za: "South Africa",
    kr: "South Korea",
    es: "Spain",
    se: "Sweden",
    ch: "Switzerland",
    tw: "Taiwan",
    th: "Thailand",
    tr: "Turkey",
    ua: "Ukraine",
    ae: "United Arab Emirates",
    gb: "United Kingdom",
    us: "United States",
    uy: "Uruguay",
    ve: "Venezuela",
    vn: "Vietnam"
  };

  const promiseList = [];
  const query1 =
    "title%3A%28%28angular+OR+angularjs+OR+angular.js%29+%28home+OR+virtual+OR+remote+OR+worldwide+OR+distributed+OR+anywhere+OR+remotely+OR+telecommuting+OR+telecommute+OR+telework+OR+wfh+OR+teleworking+OR+telecommuters+OR+telecommuter+OR+teleworkers+OR+teleworker%29%29";
  const query2 = "title%3A%28angular+OR+angularjs+OR+angular.js%29&l=remote";
  const publisherID = 5035215435251303;

  // iterate countries
  for (const co in countries) {
    const promise1 = fetch(
      `http://api.indeed.com/ads/apisearch?publisher=${publisherID}&v=2&format=json&q=${query1}&sort=date&fromage=4&co=${co}`
    );

    const promise2 = fetch(
      `http://api.indeed.com/ads/apisearch?publisher=${publisherID}&v=2&format=json&q=${query2}&sort=date&fromage=4&co=${co}`
    );

    promiseList.push(promise1, promise2);
  }

  // resolve promises
  let searchResponseList = [];
  try {
    const responseList = await Promise.all(promiseList);
    searchResponseList = await Promise.all(
      responseList.map(async response => await response.json())
    );
  } catch (err) {
    console.error(err);
  }

  // create job list
  const jobs = searchResponseList.reduce((accumulator, current) => {
    if (current.totalResults) {
      return accumulator.concat(current.results);
    }

    return accumulator;
  }, []);

  // sort jobs by date (newest to oldest)
  jobs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // create feed items
  jobs.forEach(job => {
    const filteredUrl = job.url.split("&")[0];
    const guid = filteredUrl.split("jk=")[1];

    feed.item({
      title: `[${countries[job.country.toLowerCase()]}] [${job.company}] ${
        job.jobtitle
      }`,
      description: job.snippet,
      url: filteredUrl,
      guid: guid,
      date: job.date
    });
  });

  // serve RSS
  callback(null, {
    statusCode: 200,
    body: feed.xml(),
    headers: { "Content-Type": "application/rss+xml" }
  });
};
