'use strict'

var findFirstSent = /[^\.\!\?]+[\.\!\?]/;
var regFindPublic = /\B\@\w\w+\b/g;
var isLoaded = false;
var isLoadedSignUp = false;
var saveUserRequest;
var saveUser;
var saveData;

function getUrl(method, params) {
  if (!method) {
    throw Error('There is incorrect method');
  }
  params = params || {};
  params['access_token'] = "7a5de8997a5de8997a5de899917a34fc5777a5d7a5de8992620176c45c38ea6bdcec820";
  return 'https://api.vk.com/method/' + method + '?' + $.param(params)
      + '&v=5.52';
}

onStart(getData);

function onStart(callback) {
  if (isLoaded) {
    return;
  }
  $.ajax({
    url: getUrl("wall.get", {owner_id: -179220995, fields: 'photo_500'}),
    method: "GET",
    dataType: "JSONP",
    async: false,
    success: function (data) {
      if(data != null) {
        callback(data);
      }
    },
    error: function (error) {
      throw new Error(error);
    }
  });
  isLoaded = true;
}

function closeModal(dialogName) {
  var dialog = document.querySelector('#' + dialogName);
  dialog.close();
}

function signup(requestUser) {
  console.log(requestUser);
  if (isLoadedSignUp) {
    return;
  }
  $.ajax({  
    url: "http://localhost:8080/api/v1/users",
    method: "POST",
    data: JSON.stringify(requestUser),
    contentType: "application/json",
    async: false,
    success: function (data) {
      if (data != null) {
        console.log(data);
        if(saveUserRequest != null) {

        } else {
          saveUserRequest = requestUser;
        }
      }
    },
    error: function (error) {
      throw new Error(error);
    }
  });
  isLoadedSignUp = true;
}

function checkAccess(user) {
  var result = false;
  $.ajax({
    url: "http://localhost:8080/api/v1/news",
    method: "POST",
    data: JSON.stringify(user),
    contentType: "application/json",
    async: false,
    success: function (data) {
      if (data.isPremium === true) {
        if(saveUser != null){
          
        } else {
          saveUser = user;
        }
        result = true;
      }
    },
    error: function (error) {
      throw new Error(error);
    }
  });
  return result;
}

function getAllhastTagsFromPost(text) {
  var regFindHashTag = /\B\#\w\w+\b/g;
  var hashTags = text.match(regFindHashTag);
  hashTags = removeSymbolHashtag(hashTags);
  var hashTag;
  renderCategories(hashTags);
  if (hashTags.length === 1) {
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
  var menu = document.getElementById('menu');
  if (document.getElementById(categoriesList[0]) == null) {
    var category = document.createElement("li");
    category.id = categoriesList[0];

    var category_link = document.createElement("a");
    category_link.className = "mdl-navigation__link";
    category_link.id = categoriesList[0] + '_link';
    category_link.href = '#' + categoriesList[0];
    category_link.text = categoriesList[0].charAt(0).toUpperCase()
        + categoriesList[0].slice(1);
    category_link.addEventListener('click', function () {
      getAllPostFromCategories(categoriesList[0]);
    });
    category.appendChild(category_link);
    menu.appendChild(category);
  }
  if (categoriesList.length > 1) {
    var parentCategory = document.getElementById(categoriesList[0]);
    if (document.getElementById('sub_' + categoriesList[0]) == null) {
      var subNav = document.createElement('nav');
      subNav.id = 'sub_' + categoriesList[0];
      subNav.className = 'mdl-navigation';
      parentCategory.appendChild(subNav);
    }
    var subNav = document.getElementById('sub_' + categoriesList[0]);
    for (var i = 1; i < categoriesList.length; i++) {
      if (document.getElementById(categoriesList[i] + "_link") == null) {
        var category = document.createElement("a");
        category.className = "mdl-navigation__link";
        category.id = categoriesList[i] + "_link";
        category.href = '#' + categoriesList[i];
        category.text = categoriesList[i].charAt(0).toUpperCase()
            + categoriesList[i].slice(1);
        category.addEventListener('click', function () {
          getAllPostFromCategories(categoriesList[i]);
        });
        subNav.appendChild(category);
      }
    }
    parentCategory.appendChild(subNav);
    menu.appendChild(parentCategory);
  }

  $('#sub_' + categoriesList[0]).parent().hover(function () {
    $(this).children('#sub_' + categoriesList[0]).slideDown('fast');
  }, function () {
    $(this).children('#sub_' + categoriesList[0]).slideUp('slow');
  });
}

function getAllPostFromCategories(categoryName) {
  $('#content').children().each(function () {
    if ($(this).hasClass(categoryName)) {
      $(this).removeClass('hidden');
    } else {
      $(this).addClass('hidden');
    }
  });
}

//function for get response from vk
function getData(data) {
  if (data == null || data.response == null) {
    throw new Error(
        "Cannot read data from vk group. Please contact with Nikolay Kozak");
  }
  var hashTag, postTitle, postText, postType, postImage;
  var posts = data.response.items;
  for (var i in posts) {
    var isPublic = false;
    var post = posts[i];
    postType = post.attachments[0].type;
    postText = post.text;
    if(postText.match(regFindPublic) != null){
      isPublic = true;
    }
    hashTag = getAllhastTagsFromPost(postText);
    postTitle = postText.match(findFirstSent)[0];

    if (postType === 'photo') {
      postImage = post.attachments[0]['photo']['photo_604'];
    } else if (postType === 'video') {
      postImage = post.attachments[0]['video']['photo_640'];
    } else if (postType === 'link') {
      postImage = post.attachments[0]['link']['photo']['photo_604'];
    }
    drawPosts(postImage, postTitle, postText, hashTag, isPublic);
  }
}

function drawPosts(postImage, postTitle, postText, postCategory, isPublic) {
  var card = document.createElement("div");
  card.className = postCategory + " "
      + "mdl-grid mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tabvar mdl-cell--4-col-phone mdl-card mdl-shadow--4dp";
  card.innerHTML =
      ' <div class="mdl-cell  mdl-cell--4-col-desktop mdl-cell--hide-tabvar mdl-cell--4-col-phone">\n'
      +
      '   <img class="card_image" src="' + postImage + '" alt="">\n' +
      ' </div>\n' +
      ' <div class="mdl-cell mdl-cell--8-col">\n' +
      '   <h2 id="title" style="margin-right: 30px;" class="mdl-card__title-text mdl-card--expand">'
      + postTitle + '</h2>\n' +
      '         <div class="mdl-card__menu mdl-cell--hide-phone">\n' +
      '             <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">\n'
      +
      '               <i class="material-icons">share</i></button>\n' +
      '           </div>\n' +
      '           <div class="mdl-card__supporting-text no-left-padding">\n' +
      '             <p>' + postText.slice(0, 400) + '...' + '</p>\n' +
      '           </div>\n' +
      '           <div style="text-align: right;" class="mdl-card__actions mdl-card--border">\n'
      +
      '             <a id=' + postCategory.replace(/\s/g,
      "_")
      + '_read-more class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Read more</a\n'
      +
      '           </div>\n' +
      ' </div>\n';
  var content = document.getElementById("content");
  content.appendChild(card);

  var readMore = document.getElementById(
      postCategory.replace(/\s/g, "_") + '_read-more');
  readMore.addEventListener('click', function () {
    if (!isGetAccessToArticle(postImage, postTitle, postText, isPublic)) {
      getLoginPage(postImage, postTitle, postText);
    }
  }, false);

}

function getPayPage(user, postImage, postTitle, postText) {
  var dialog = document.querySelector('#payModal');
  dialog.showModal();
  document.querySelector('#payForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var pay = {
      cardNumber: formData.get("cardNumber")
    };
    var userRequest = {
      user: user,
      pay: pay
    };
    dialog.close();
    signup(userRequest);
    if(checkAccess(user)){
      if(isOpenNewArticle(postImage, postTitle, postText)){
         dialog.close();
      } else {
        dialog.close();
        throw new Error("Can't open new article");
      }
    } 
  });
}

function getSignUpPage(postImage, postTitle, postText) {
  var dialog = document.querySelector('#signUpModal');
  dialog.showModal();
  document.querySelector('#signUpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var user = {
      userName: document.getElementById("userNameInput_signUpModal").value,
      password: document.getElementById("passwordInput_signUpModal").value
    };
    dialog.close();
    console.log(user);
    getPayPage(user, postImage, postTitle, postText);
  });
  document.querySelector('.show-login').addEventListener('click', function () {
    dialog.close();
    getLoginPage(postImage, postTitle, postText);
  });
}

function getLoginPage(postImage, postTitle, postText) {
  var dialog = document.querySelector('#signInModal');
  dialog.showModal();
  document.querySelector('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    var user = {
      userName: document.getElementById("userNameInput_signInModal").value,
      password: document.getElementById("passwordInput_signInModal").value
    };
    if (checkAccess(user)) {
      if(isOpenNewArticle(postImage, postTitle, postText)){
         dialog.close();
         return;
      } else {
        dialog.close();
        throw new Error("Can't open new article");
      }
    } else {
      dialog.close();
      getSignUpPage(postImage, postTitle, postText);
      throw new Error("You don't have access. Pls pay");
    }
  });
  document.querySelector('.showSignUp').addEventListener('click', function () {
    dialog.close(); 
    getSignUpPage(postImage, postTitle, postText);
  });
}

function isOpenNewArticle(postImage, postTitle, postText) {
  var OpenWindow = window.open("post.html#" + postText.replace(/\s/g, "_"));
  OpenWindow.onload = function () {
    OpenWindow.init(postImage, postTitle, postText);
    return false;
  };
  return true;
}

function isGetAccessToArticle(postImage, postTitle, postText, isPublic) {
  if(isPublic != null && isPublic) { return isOpenNewArticle(postImage, postTitle, postText); } 
  if (saveUser != null && checkAccess(saveUser)) { return isOpenNewArticle(postImage, postTitle, postText); } 
  else if (saveUserRequest != null && checkAccess(saveUserRequest.user)) { return isOpenNewArticle(postImage, postTitle, postText); } 
  else { return false; }
}

$("#fixed-header-drawer-exp").on("keyup", function () {
  var value = $(this).val();
  count = 0;
  $(".mdl-card").each(function (index) {
    $row = $(this);
    var title = $row.find("#title").text();

    if ($(this).text().search(new RegExp(value, "i")) < 0) {
      $row.hide();
    } else {
      $row.show();
      count++;
    }
  });
});
