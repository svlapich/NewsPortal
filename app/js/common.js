const token = 'a8604e5da8604e5da8604e5d3ca809ad4faa860a8604e5df4ce2dfea4a7526bfd377d24';
const findFirstSent = /[^\.\!\?]+[\.\!\?]/;
let regFindPublic = /\B\@\w\w+\b/g;
let isLoaded = false;

let saveUserRequest;
let saveUser;

function getUrl(method, params) {
  if (!method) {
    throw Error('There is incorrect method');
  }
  params = params || {};
  params['access_token'] = token;
  return 'https://api.vk.com/method/' + method + '?' + $.param(params)
      + '&v=5.52';
}

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
      callback(data);
    },
    error: function (error) {
      throw new Error(error);
    }
  });
  isLoaded = true;
}

onStart(getData);

function getAllhastTagsFromPost(text) {
  let regFindHashTag = /\B\#\w\w+\b/g;
  let hashTags = text.match(regFindHashTag);
  hashTags = removeSymbolHashtag(hashTags);
  let hashTag;
  renderCategories(hashTags);
  if (hashTags.length === 1) {
    hashTag = hashTags[0];
  } else {
    hashTag = hashTags.join(' ');
  }
  return hashTag;
}

function removeSymbolHashtag(hashTags) {
  for (let i = 0; i < hashTags.length; i++) {
    hashTags[i] = hashTags[i].slice(1);
  }
  return hashTags;
}

function renderCategories(categoriesList) {
  let menu = document.getElementById('menu');
  if (document.getElementById(categoriesList[0]) == null) {
    let category = document.createElement("li");
    category.id = categoriesList[0];

    let category_link = document.createElement("a");
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
    let parentCategory = document.getElementById(categoriesList[0]);
    if (document.getElementById('sub_' + categoriesList[0]) == null) {
      let subNav = document.createElement('nav');
      subNav.id = 'sub_' + categoriesList[0];
      subNav.className = 'mdl-navigation';
      parentCategory.appendChild(subNav);
    }
    let subNav = document.getElementById('sub_' + categoriesList[0]);
    for (let i = 1; i < categoriesList.length; i++) {
      if (document.getElementById(categoriesList[i] + "_link") == null) {
        let category = document.createElement("a");
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
  let hashTag, postTitle, postText, postType, postImage;
  let posts = data.response.items;
  for (let i in posts) {
    let isPublic = false;
    let post = posts[i];
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
  let card = document.createElement("div");
  card.className = postCategory + " "
      + "mdl-grid mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp";
  card.innerHTML =
      ' <div class="mdl-cell  mdl-cell--4-col-desktop mdl-cell--hide-tablet mdl-cell--4-col-phone">\n'
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
  let content = document.getElementById("content");
  content.appendChild(card);

  let readMore = document.getElementById(
      postCategory.replace(/\s/g, "_") + '_read-more');
  readMore.addEventListener('click', function () {
    if (getArticle(postImage, postTitle, postText, isPublic)) {
      getLoginPage(postImage, postTitle, postText, isPublic);
    }
  }, false);

}

function getPayPage(user) {
  closeModal("signUpModal");
  let dialog = document.querySelector('#payModal');
  dialog.showModal();
  document.querySelector('#payForm').addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    let pay = {
      cardNumber: formData.get("cardNumber")
    };
    let userRequest = {
      user: user,
      pay: pay
    };
    dialog.close();
    e.preventDefault();
    signup(userRequest);
  });
}

function getSignUpPage() {
  closeModal("signInModal");
  let dialog = document.querySelector('#signUpModal');
  dialog.showModal();
  document.querySelector('#signUpForm').addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    let user = {
      userName: document.getElementById("userNameInput_signInModal").value,
      password: document.getElementById("passwordInput_signInModal").value
    };
    dialog.close();
    e.preventDefault();
    getPayPage(user);
  });
}

function getLoginPage(postImage, postTitle, postText, isPublic) {
  closeModal("signUpModal");
  let dialog = document.querySelector('#signInModal');
  dialog.showModal();

  let payModal = document.querySelector('#payModal');
  let signUpModal = document.querySelector('#signUpModal');
  document.querySelector('#loginForm').addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    let user = {
      userName: document.getElementById("userNameInput_signInModal").value,
      password: document.getElementById("passwordInput_signInModal").value
    };
    if (checkAccess(user)) {
      getArticle(postImage, postTitle, postText, isPublic);
      dialog.close();
      e.preventDefault();
    } else {
      dialog.close();
      e.preventDefault();
      getSignUpPage();
    }
  });
}

function closeModal(dialogName) {
  let dialog = document.querySelector('#' + dialogName);
  dialog.close();
}

let isLoadedSignUp = false;

function signup(requestUser) {
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
        saveUserRequest = requestUser
      } else {
        throw new Error("error");
      }
    },
    error: function (error) {
      throw new Error(error);
    }
  });
  isLoadedSignUp = true;
}

function checkAccess(user) {
  let result = false;
  $.ajax({
    url: "http://localhost:8080/api/v1/news",
    method: "POST",
    data: JSON.stringify(user),
    contentType: "application/json",
    async: false,
    success: function (data) {
      saveUser = user;
      if (data.isPremium === true) {
        result = true;
      }
    },
    error: function (error) {
      throw new Error(error);
    }
  });
  return result;
}

function getArticle(postImage, postTitle, postText, isPublic) {
  if(isPublic) {
    let OpenWindow = window.open("post.html#" + postText.replace(/\s/g, "_"));
    OpenWindow.onload = function () {
      OpenWindow.init(postImage, postTitle, postText);
    };
    return false;
  } else if (saveUser != null && checkAccess(saveUser)) {
    let OpenWindow = window.open("post.html#" + postText.replace(/\s/g, "_"));
    OpenWindow.onload = function () {
      OpenWindow.init(postImage, postTitle, postText);
    };
    return false;
  } else if (saveUserRequest != null && checkAccess(saveUserRequest.user)) {
    let OpenWindow = window.open("post.html#" + postText.replace(/\s/g, "_"));
    OpenWindow.onload = function () {
      OpenWindow.init(postImage, postTitle, postText);
    };
    return false;
  } else {
    return true;
  }
  return true;
}

$("#fixed-header-drawer-exp").on("keyup", function () {
  let value = $(this).val();
  count = 0;
  $(".mdl-card").each(function (index) {
    $row = $(this);
    let title = $row.find("#title").text();

    if ($(this).text().search(new RegExp(value, "i")) < 0) {
      $row.hide();
    } else {
      $row.show();
      count++;
    }
  });
});