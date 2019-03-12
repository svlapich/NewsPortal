var regFindHastTag = /\B\#\w\w+\b/g;
var regFindEmail = /@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])/g;
var findFirstSent = /[^\.\!\?]+[\.\!\?]/;


$(document).ready(function() {
  onStart(getPosts);
});


//function for get response from vk
function getPosts(data) {
  var hashTag, postCode, postTitle, postText, attachment, photoSize;
  var posts = data.response.items;
  for (var i in posts) {
    var post = posts[i];
    hastTag = post.text.match(regFindHastTag);
    postCode = post.text.match(regFindEmail);
    postText = post.text.replace(hastTag, '').replace(postCode, '');
    postTitle = postText.match(findFirstSent);
    if (post.attachments[0]['photo']) {
      attachment = 'photo';
      photoSize = 'photo_604';
    } else if (post.attachments[0]['video']) {
      attachment = 'video';
      photoSize = 'photo_640';
    } else if (post.attachments[0]['link']) {
      attachment = 'link';
      photoSize = 'photo_640' //TODO doesnt work
    }
    console.log(post);
    drawPosts(post.attachments[0][attachment][photoSize], 
      postTitle, postText, hashTag, postCode);
  }
}

function getUrl(method, params) {
  if (!method) throw Error('There is incorrect method');
  params = params || {};
  params['access_token'] = '7a5de8997a5de8997a5de899917a34fc5777a5d7a5de8992620176c45c38ea6bdcec820';
  return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}

function drawPosts(postImage, postTitle, postText, hashTag, postCode) {
  var htmlFields = '';
  htmlFields +=
    '<div class="mdl-grid mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp">\n' +
    ' <div class="mdl-cell  mdl-cell--4-col-desktop mdl-cell--hide-tablet mdl-cell--4-col-phone">\n' +
    '   <img class="card_image" src="' + postImage + '" alt="">\n' +
    ' </div>\n' +
    '   <div class="mdl-cell mdl-cell--8-col">\n' +
    '   <h2 class="mdl-card__title-text mdl-card--expand">' + postTitle + '</h2>\n' +
    '         <div class="mdl-card__menu mdl-cell--hide-phone">\n' +
    '             <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">\n' +
    '               <i class="material-icons">share</i></button>\n' +
    '           </div>\n' +
    '           <div class="mdl-card__supporting-text no-left-padding">\n' +
    '             <p>' + postText + '...' + '</p>\n' +
    '           </div>\n' +
    '           <div class="mdl-card__subtitle-text">\n' +
    '             <span>Category: <a href="#">' + hastTag + '</a></span>\n' +
    '           </div>\n' +
    '           <div style="text-align: right;" class="mdl-card__actions mdl-card--border">\n' +
    '       <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Read more</a>\n' +
    '           </div>\n' +
    ' </div>\n' +
    '</div>';
  $('#content').append(htmlFields);
}

var isLoaded = false;

function onStart(callback) {
  if (isLoaded) return;
  $.ajax({
    url: getUrl("wall.get", { owner_id: -179220995, fields: 'photo_500' }),
    method: "GET",
    dataType: "JSONP",
    async: false,
    success: function(data) {
      callback(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
  isLoaded = true;
}