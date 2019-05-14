$(document).ready(function() {
  var token = '7a5de8997a5de8997a5de899917a34fc5777a5d7a5de8992620176c45c38ea6bdcec820';
  var findFirstSent = /[^\.\!\?]+[\.\!\?]/;
  var saveName = null;
  var savePassword = null;

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

  function getAllhastTagsFromPost(text) {
    let regFindHashTag = /\B\#\w\w+\b/g;
    let hashTags = text.match(regFindHashTag);
    hashTags = removeSymbolHashtag(hashTags);
    let hashTag;
    renderCategories(hashTags);
    if(hashTags.length == 1) {
      hashTag = hashTags[0];
    } else {
      hashTag = hashTags.join(' ');
    }
    return hashTag;
  }

  function removeSymbolHashtag(hashTags) {
    for (var i = 0; i < hashTags.length; i++) {
      hashTags[i] = hashTags[i].slice(1);
    }
    return hashTags;
  }

  function renderCategories(categoriesList) {
    let menu = document.getElementById('menu');
    if(document.getElementById(categoriesList[0]) == null) {
      let category = document.createElement("li");
      category.id = categoriesList[0];

      let category_link = document.createElement("a");
      category_link.className = "mdl-navigation__link";
      category_link.id = categoriesList[0] + '_link';
      category_link.text = categoriesList[0].charAt(0).toUpperCase() + categoriesList[0].slice(1);
      category_link.addEventListener('click', function() {
        getAllPostFromCategories(categoriesList[0]);
      })
      category.appendChild(category_link);
      menu.appendChild(category);
    }
    if(categoriesList.length > 1) {
      let parentCategory = document.getElementById(categoriesList[0]);
      if(document.getElementById('sub_' + categoriesList[0]) == null) {
        let subNav = document.createElement('nav');
        subNav.id = 'sub_' + categoriesList[0];
        subNav.className = 'mdl-navigation hidden';
        parentCategory.appendChild(subNav);
      }
      let subNav = document.getElementById('sub_' + categoriesList[0]);
      for (let i = 1; i < categoriesList.length; i++) {
        if(document.getElementById(categoriesList[i] + "_link") == null) {
          let category = document.createElement("a");
          category.className = "mdl-navigation__link";
          category.id = categoriesList[i] + "_link";
          category.text = categoriesList[i].charAt(0).toUpperCase() + categoriesList[i].slice(1);
          category.addEventListener('click', function() {
            getAllPostFromCategories(categoriesList[i]);
          })
          subNav.appendChild(category);
        }
      }
      parentCategory.appendChild(subNav);
      menu.appendChild(parentCategory);
    }

    $('#sub_' + categoriesList[0]).parent().hover(function() {
      var submenu = $('#sub_' + categoriesList[0]);
      if ( $(submenu).is(':hidden') ) {
        $(submenu).slideDown(300);
        $(submenu).removeClass("hidden")
      } else {
        $(submenu).slideUp(300);
      }
    });

  }

  function getAllPostFromCategories(categoryName) {
    var content = document.getElementById("content");
    var category = document.querySelectorAll('[id=categoryName]');
    var html = '';
    content.innerHTML = '';
    for (var j in category) {
      var categoryPost = category[j];
      console.log(categoryPost);
      html = categoryPost;
      content.appendChild(html);
    }
  }


  //function for get response from vk
  function getData(data) {
    console.log(data);
    if(data == null || data.response == null) {
      throw new Error("Cannot read data from vk group. Please contact with Nikolay Kozak");
    }
    var hashTag, postTitle, postText, postType, postImage;
    var posts = data.response.items;
    for (var i in posts) {
      var post = posts[i];
      console.log(post);

      postType = post.attachments[0].type;
      postText = post.text;
      hashTag = getAllhastTagsFromPost(postText);
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
  }

  $("#fixed-header-drawer-exp").on("keyup", function() {
      var value = $(this).val();
      count = 0;
      $(".mdl-card").each(function(index) {

        $row = $(this);

        var title = $row.find("#title").text();

        if ($(this).text().search(new RegExp(value, "i")) < 0) {
          $row.hide(); // MY CHANGE

          // Show the list item if the phrase matches and increase the count by 1
        } else {
          $row.show(); // MY CHANGE
          count++;
        }
      });
    });

  function drawPosts(postImage, postTitle, postText, postCategory) {
    var card = document.createElement("div");
    card.className = postCategory + " " + "mdl-grid mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp";
    card.innerHTML =
      ' <div class="mdl-cell  mdl-cell--4-col-desktop mdl-cell--hide-tablet mdl-cell--4-col-phone">\n' +
      '   <img class="card_image" src="' + postImage + '" alt="">\n' +
      ' </div>\n' +
      ' <div class="mdl-cell mdl-cell--8-col">\n' +
      '   <h2 id="title" style="margin-right: 30px;" class="mdl-card__title-text mdl-card--expand">' + postTitle + '</h2>\n' +
      '         <div class="mdl-card__menu mdl-cell--hide-phone">\n' +
      '             <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">\n' +
      '               <i class="material-icons">share</i></button>\n' +
      '           </div>\n' +
      '           <div class="mdl-card__supporting-text no-left-padding">\n' +
      '             <p>' + postText.slice(0, 400) + '...' + '</p>\n' +
      '           </div>\n' +
      '           <div style="text-align: right;" class="mdl-card__actions mdl-card--border">\n' +
      '             <a id="read-more" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Read more</a\n' +
      '           </div>\n' +
      ' </div>\n';
    var content = document.getElementById("content");
    content.appendChild(card);
    var button = document.getElementById('read-more');
    button.addEventListener('click', function() { 
      event.preventDefault();
      this.blur(); // Manually remove focus from clicked link.
      getArticle(postImage, postTitle, postText, postCategory), false });
  }


  function signup(name, pass, card) {
    
    var request = {
      user : {
        userName: name,
        password: pass
      },
      pay: {
        cardNumber: card
      }
    };

    var jsondata = JSON.stringify(request);

    $.ajax({
      url: "http://localhost:8080/api/v1/users", 
      method: "POST",
      data: jsondata,
      contentType: "application/json",
      async: false,
      success: function(data) {
        if(data != null){
          saveName = data.userName;
          savePassword = data.password;
        } else {
          throw new Error("error");
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  function checkAccess(name, pass) {
    var jsondata = JSON.stringify({
          userName:name,
          password:pass
    });  
    $.ajax({
      url: "http://localhost:8080/api/v1/news", 
      method: "POST",
      data: jsondata,
      contentType: "application/json",
      async: false,
      success: function(data) {
        if(data.isPremium == true){
          return true;
        } else {
          return false;
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  function getArticle(postImage, postTitle, postText, postCategory) {


    // var article =
    //   ' <div class="article_header">\n' +
    //   '   <h1>' + postTitle + '</h1>\n' +
    //   ' </div>\n' +
    //   ' <div class="article__content">\n' +
    //   '   <div class="article_image__wrapper">\n' +
    //   '     <img class="article_image" src="' + postImage + '" alt="">\n' +
    //   '   </div>\n' +
    //   '   <div class="article_text">' + postText + '</div>\n' +
    //   '   <div class="article_like"></div>\n' +
    //   ' </div>\n'
    // var content = document.getElementById("content");
    // content.innerHTML = article;
  }

});

