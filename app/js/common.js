$(document).ready(function() {
  var token = '7a5de8997a5de8997a5de899917a34fc5777a5d7a5de8992620176c45c38ea6bdcec820';
  var regFindHashTag = /\B\#\w\w+\b/g;
  var regFindEmail = /@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])/g;
  var findFirstSent = /[^\.\!\?]+[\.\!\?]/;

  function getUrl(method, params) {
    if (!method) throw Error('There is incorrect method');
    params = params || {};
    params['access_token'] = token;
    return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
  }

  onStart(getData);

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
    }
    content = document.getElementById("content");
    science = document.querySelectorAll(".science");
    business = document.querySelectorAll(".business");
    health = document.querySelectorAll(".health");
    chill = document.querySelectorAll(".Chill");
    document.getElementById("science").addEventListener('click', function() {
      var html = '';
      content.innerHTML = '';
      for (var j in science) {
        var sciencePost = science[j];
        console.log(sciencePost);
        html = sciencePost;
        content.appendChild(html);
      }
    });
    document.getElementById("business").addEventListener('click', function() {
      var html = '';
      content.innerHTML = '';
      for (var j in business) {
        var sciencePost = business[j];
        console.log(sciencePost);
        html = sciencePost;
        content.appendChild(html);
      }
    });
    document.getElementById("chill").addEventListener('click', function() {
      var html = '';
      content.innerHTML = '';
      for (var j in chill) {
        var chillPost = chill[j];
        console.log(chillPost);
        html = chillPost;
        content.appendChild(html);
      }
    });
    document.getElementById("health").addEventListener('click', function() {
      var html = '';
      content.innerHTML = '';
      for (var j in health) {
        var sciencePost = health[j];
        console.log(sciencePost);
        html = sciencePost;
        content.appendChild(html);
      }
    });
  }

  function drawPosts(postImage, postTitle, postText, hashTag, postCode) {
    var card = document.createElement("div");
    card.className = hashTag.replace('#', '') + " " + "mdl-grid mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp";
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
      '       			<button id="read-more" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Read more</button\n' +
      '           </div>\n' +
      ' </div>\n';
    card.addEventListener('click', function() { getArticle(postImage, postTitle, postText, hashTag), false });
    var content = document.getElementById("content");
    content.appendChild(card);
  }

  function getArticle(postImage, postTitle, postText, hashTag) {
    var article =
      ' <div class="article_header">\n' +
      '   <h1>' + postTitle + '</h1>\n' +
      ' </div>\n' +
      ' <div class="article__content">\n' +
      '   <div class="article_image__wrapper">\n' +
      '     <img class="article_image" src="' + postImage + '" alt="">\n' +
      '   </div>\n' +
      '   <div class="article_text">' + postText + '</div>\n' +
      '   <div class="article_like"></div>\n' +
      ' </div>\n'
    var content = document.getElementById("content");
    content.innerHTML = article;
  }
});