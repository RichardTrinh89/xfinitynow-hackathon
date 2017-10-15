var Promise = require('bluebird');
const rp = require('request-promise-native');
const settings = require('../../../../settings');
const moment = require('moment');

/**
 *
 * {
    "video_url":"https://d3soezdrjjkk7w.cloudfront.net/WatchWith_Development_Account/326/919/Snowman_4ads__878737.mp4",
    "items":[
        {
        "brand_icon":"",
        "brand_feature":"",
        "brand_name":"",

        "picture":"",
        "title":"",
        "description":"",
        "stating_at":1000,
        "ending_at":2000
        }
    ]
}
 */

function _getWatchWith(ids) {
  return new Promise(function (resolve, reject) {
    rp.get(settings.WATCHWITH_API).then((res) => {
      res = JSON.parse(res);
      let r = {
        "video_url": "https://d3soezdrjjkk7w.cloudfront.net/WatchWith_Development_Account/326/919/Snowman_4ads__878737.mp4",
        "items": []
      };
      res.timeline.events.forEach(function (tl) {
        let found;
        if (ids && ids.length !== 0) {
          found = ids.find(function (element) {
            return element == tl.card.object.uuid;
          });
        }

        if (found || !found && !ids) {
          let timeline = {
            "id": tl.card.object.uuid,
            "brand_icon": null,
            "brand_feature": null,
            "brand_name": null,

            "type": tl.card.object.type ? tl.card.object.type : tl.card.type,
            "picture": tl.card.object.image.url,
            "title": tl.card.object.description,
            "short_description": tl.card.object.description,
            "full_description": tl.card.object.description,
            "stating_at": tl.in,
            "ending_at": tl.out
          };
          if (timeline.type === 'Commercial') {
            timeline.brand_name = timeline.title.split(' ')[0];
          }
          if (timeline.type === 'Message') {
            timeline.short_description = tl.card.object.message;
            timeline.title = tl.card.object.title;
            timeline.brand_feature = tl.card.object.message;
            timeline.brand_name = tl.card.object.title;
          } else if (timeline.type === 'Commercial') {
            if (timeline.title.includes('Gap')) {
              timeline.brand_feature = 'Cher'
              timeline.brand_icon = 'https://raw.githubusercontent.com/RichardTrinh89/test_images/master/GAP.png';
            } else if (timeline.title.includes('Nexium')) {
              timeline.brand_feature = 'Relief';
              timeline.brand_icon = 'https://raw.githubusercontent.com/RichardTrinh89/test_images/master/Nexium.png';
            } else if (timeline.title.includes('FIOS')) {
              timeline.brand_feature = 'Internet'
              timeline.brand_icon = 'https://raw.githubusercontent.com/RichardTrinh89/test_images/master/fios.png';
            }
          }
          r.items.push(timeline);
        }
      });
      return resolve(r);
    }).catch((err) => {
      return resolve(err);
    });
  })
}

function _getRottenTomatoes(timeline) {
  return new Promise(function (resolve, reject) {
    var options = {
      uri: settings.ROTTEN_TOMATOS_API,
      headers: {
        'x-api-key': 'GtoO4G82xr3HagLQdTzc7191YuAvSuqN2LVUGrvI',
      },
      json: true
    };
    rp(options).then((res) => {
      if (timeline.full_description === "The Snowman Movie Trailer") {
        timeline.picture = "https://flxt.tmsimg.com/assets/p13434062_p_v8_aa.jpg"

        var release_date = res.theater_releases.find(function (element) {
          return element.country === "USA";
        })
        let release = moment(release_date.date).format('MMMM DD, YYYY');
        // let release = 'October 20, 2017'
        timeline.short_description = `Rated: ${res.mpaa_rating}. In Theaters ${release}`;
        // timeline.short_description = `Rated: R. In Theaters ${release}`;
        timeline.full_description = res.synopsis;
        // timeline.full_description = 'For Detective Harry Hole, the death of a young woman during the first snowfall of winter feels like anything but a routine homicide. His investigation leads him to \"The Snowman Killer,\" an elusive sociopath who continuously taunts Hole with cat-and-mouse games. As the vicious murders continue, Harry teams up with a brilliant recruit to try and lure the madman out of the shadows before he can strike again.';
        timeline.brand_icon = 'http://jasontremain.com/img/Fandango_Logo_2x.png';
        timeline.brand_name = "Fandango";
        timeline.brand_feature = "Advanced Ticketing";
        return timeline;
      } else return timeline;
    }).catch(function (err) {
      reject(err);
    }).then(function(res) {
      resolve(res);
    })
  });
}

module.exports = {
  get_all: function (request, response) {
    _getWatchWith().then(function (res) {
      let newRes = [];
      let final = [];
      res.items.forEach(function (item) {
        newRes.push(_getRottenTomatoes(item));
      })
      Promise.all(newRes).then(function (timeline) {
        return timeline;
      }).then(function (final) {
        res.items = final;
        response(res);
      })
    }).catch(function (err) {
      response(err);
    })
  },

  get_by_ids: function (request, response) {
    return new Promise(function (resolve, reject) {
      _getWatchWith(request.payload.ids).then(function (res) {
        let newRes = [];
        let final = [];
        res.items.forEach(function (item) {
          newRes.push(_getRottenTomatoes(item));
        })
        Promise.all(newRes).then(function (timeline) {
          return timeline;
        }).then(function (final) {
          res.items = final;
          response(res);
        })
      }).catch(function (err) {
        response(err);
      })
    })
  }
};
