/**
 * 
 * @param {string} videoUrl - Facebook video URL (required)
 * @param {string} [cookie] - Facebook cookie (optional)
 * @param {string} [useragent] - User agent (optional)
 * @returns 
*/
const getFBInfo = (videoUrl, cookie, useragent) => {
  const axios = require("axios");
  const _ = require("underscore");

  const headers = {
    "sec-fetch-user": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "cache-control": "max-age=0",
    authority: "www.facebook.com",
    "upgrade-insecure-requests": "1",
    "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
    "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    "user-agent":
      useragent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    cookie:
      cookie || "sb=Rn8BYQvCEb2fpMQZjsd6L382; datr=Rn8BYbyhXgw9RlOvmsosmVNT; c_user=100003164630629; _fbp=fb.1.1629876126997.444699739; wd=1920x939; spin=r.1004812505_b.trunk_t.1638730393_s.1_v.2_; xs=28%3A8ROnP0aeVF8XcQ%3A2%3A1627488145%3A-1%3A4916%3A%3AAcWIuSjPy2mlTPuZAeA2wWzHzEDuumXI89jH8a_QIV8; fr=0jQw7hcrFdas2ZeyT.AWVpRNl_4noCEs_hb8kaZahs-jA.BhrQqa.3E.AAA.0.0.BhrQqa.AWUu879ZtCw",
  };

  const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

  return new Promise((resolve, reject) => {
    if (!videoUrl || !videoUrl.trim()) return reject("Please specify the Facebook URL");

    if (
      ["facebook.com", "fb.watch"].every((domain) => !videoUrl.includes(domain))
    ) return reject("Please enter the valid Facebook URL");

    axios.get(videoUrl, { headers }).then(({ data }) => {
      data = data.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      
      let pageStringArray = data.split('<script');
      pageStringArray = _.filter(pageStringArray, string => string.includes('type="application/json"'));
      pageStringArray = _.filter(pageStringArray, string => string.includes('RelayPrefetchedStreamCache'));
      pageStringArray = _.filter(pageStringArray, string => string.includes('all_video_dash_prefetch_representations'));
      pageStringArray = _.compact(pageStringArray.map(string => string.split('data-sjs>')[1]));
      pageStringArray = _.compact(pageStringArray.map(string => string.split('</script>')[0]));
      let pageObjectArray = pageStringArray.map(string => JSON.parse(string).require[0][3]);
      pageObjectArray = _.flatten(_.compact(pageObjectArray.map(subArray => {
          return _.filter(subArray, subObject => {
              const subKeys = _.keys(subObject);
              return _.some(subKeys, subKey => subObject[subKey]);
          });
      })));
      pageObjectArray = pageObjectArray.map(pageObject => {
          return _.find(pageObject.__bbox.require, subArray => subArray[0] == 'RelayPrefetchedStreamCache');
          
      });
      pageObjectArray = pageObjectArray.map(pageObjectArray => pageObjectArray[3][1].__bbox.result);

      const formats = pageObjectArray[0].extensions.all_video_dash_prefetch_representations[0].representations;
      const videoFormats = _.sortBy(_.filter(formats, format => format.mime_type == 'video/mp4'), format => format.width).reverse();
      const audioFormats = _.sortBy(_.filter(formats, format => format.mime_type == 'audio/mp4'), format => format.bandwidth).reverse();

      const videoId = pageObjectArray[0].data.video.id;
      const thumbnail = pageObjectArray[0].data.video.story.attachments[0].media.preferred_thumbnail.image.uri;
      const bestVideo = _.isEmpty(videoFormats) ? null : videoFormats[0].base_url;
      const bestAudio = _.isEmpty(audioFormats) ? null : audioFormats[0].base_url;

      if (bestVideo && bestAudio) {
        const result = {
          url: videoUrl,
          videoId: videoId,
          videoStream: bestVideo,
          audioStream: bestAudio,
          thumbnail: thumbnail
        };

        resolve(result);
      } else reject("Unable to fetch video information at this time. Please try again");
    }).catch(_ => reject("Unable to fetch video information at this time. Please try again"));
  });
};

// getFBInfo("https://www.facebook.com/watch?v=272591278381388").then(console.log).catch(console.log);

module.exports = getFBInfo;
