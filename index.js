/*

Slash Webtasks: Extend Slack with Node.js, powered by Auth0 Webtasks (https://webtask.io)
For documentation, go to https://github.com/auth0/slash
You can find us on Slack at https://webtask.slack.com (join via http://chat.webtask.io)

*/
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('underscore');

module.exports = (ctx, cb) => {
  // TIPS:
  // 1. Input and output: https://github.com/auth0/slash#inputs-and-outputs
  // 2. Response formatting: https://api.slack.com/docs/messages/builder
  // 3. Secrets you configure using the key icon are available on `ctx.secrets`

  const options = {
      uri: 'http://imgur.com/r/cats/top/day',
      transform:  body => cheerio.load(body)
  };

  rp(options)
    .then(($) => {
      const posts = $("div[class='post']");
      const attachments = _.map(posts, post => {
        const node = $(`#${post.attribs.id}`);
        return {
          fallback: 'Kittens!',
          image_url: `http:${node.find('img').attr('src')}`,
          text: node.find('p').text(),
          footer: node.find('.post-info').text().trim().replace( /^\D+/g, ''),
        }
      });
      cb(null, {attachments});
    })
    .catch((err) => {
     cb(err, null);
    })
}
