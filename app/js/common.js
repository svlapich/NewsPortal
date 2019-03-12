var regFindHashTag = /\B\#\w\w+\b/g;
var regFindEmail = /@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])/g;
var findFirstSent = /[^\.\!\?]+[\.\!\?]/;

onStart(getData);

//function for get response from vk
function getData(data) {
  var hashTag, postCode, postTitle, postText, postType, postImage;
  var posts = data.response.items;
  for (var i in posts) {
    var post = posts[i];

    postType = post.attachments[0].type;
    hashTag = post.text.match(regFindHashTag)[0];
    postCode = post.text.match(regFindEmail)[0];
    postText = post.text.replace(hashTag, '').replace(postCode, '');
    postTitle = postText.match(findFirstSent)[0];

    if (postType == 'photo') {
      postImage = post.attachments[0]['photo']['photo_604'];
    } else if (postType == 'video') {
      postImage = post.attachments[0]['video']['photo_640'];
    } else if (postType == 'link') {
      postImage = post.attachments[0]['link']['photo']['photo_604'];
    }
    drawPosts(postImage, postTitle, postText, hashTag, postCode);
  };
}


function getUrl(method, params) {
  if (!method) throw Error('There is incorrect method');
  params = params || {};
  params['access_token'] = '7a5de8997a5de8997a5de899917a34fc5777a5d7a5de8992620176c45c38ea6bdcec820';
  return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}

function drawPosts(postImage, postTitle, postText, hashTag, postCode) {
  var card = document.createElement('div');
  card.className = "mdl-grid mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp";
  card.innerHTML =
    ' <div class="mdl-cell  mdl-cell--4-col-desktop mdl-cell--hide-tablet mdl-cell--4-col-phone">\n' +
    '   <img class="card_image" src="' + postImage + '" alt="">\n' +
    ' </div>\n' +
    '   <div class="mdl-cell mdl-cell--8-col">\n' +
    '   <h2 style="margin-right: 30px;" class="mdl-card__title-text mdl-card--expand">' + postTitle + '</h2>\n' +
    '         <div class="mdl-card__menu mdl-cell--hide-phone">\n' +
    '             <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">\n' +
    '               <i class="material-icons">share</i></button>\n' +
    '           </div>\n' +
    '           <div class="mdl-card__supporting-text no-left-padding">\n' +
    '             <p>' + postText.slice(0, 400) + '...' + '</p>\n' +
    '           </div>\n' +
    '           <div class="mdl-card__subtitle-text">\n' +
    '             <span>Category: <a href="#">' + hashTag + '</a></span>\n' +
    '           </div>\n' +
    '           <div style="text-align: right;" class="mdl-card__actions mdl-card--border">\n' +
    '       <button id="read-more" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Read more</button\n' +
    '           </div>\n' +
    ' </div>\n';
  card.addEventListener('click', function() {
    displayPostOnNewPage(postImage, postTitle, postText, hashTag);
  }, false);
  var o = document.getElementById("content");
  o.appendChild(card);
}

function displayPostOnNewPage(postImage, postTitle, postText, hashTag) {
  var postWindow = window.open("post.html");
  var newArticle =
    ' <div class="article_header">\n' +
    '   <h1>' + postTitle + '</h1>\n' +
    ' </div>\n' +
    ' <div class="article__content">\n' +
    '   <div class="article_image__wrapper">\n' +
    '     <img class="article_image" src="' + postImage + '" alt="">\n' +
    '   </div>\n' +
    '   <div class="article_text">' + postText + '</div>\n' +
    '   <div class="article_tags">\n' +
    '     <span>Category: <a href="#">' + hashTag + '</a></span>\n' +
    '   </div>\n' +
    '   <div class="article_like"></div>\n' +
    ' </div>\n'
  postWindow.onload = function() {
    postWindow.document.getElementById("full-post").innerHTML = newArticle;
  }
  postWindow.focus()
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