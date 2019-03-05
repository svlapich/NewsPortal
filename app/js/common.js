
// https://oauth.vk.com/blank.html#access_token=a8dc9c473d0294fdaa38f4095c4964cdbe1ac7b8246982444133117e0301ee9e6bdad2ef325672be3215f&expires_in=86400&user_id=163676173
// a8dc9c473d0294fdaa38f4095c4964cdbe1ac7b8246982444133117e0301ee9e6bdad2ef325672be3215f
//https://api.vk.com/method/users.get?user_id=6886606&v=5.52
// + post.attachments[0]['photo'].photo_604+
// public179220995
    $(document).ready(function () {
        onStart();
    });

    function getUrl(method, params){
        if(!method) throw Error('There is incorrect method');
        params = params || {};
        params['access_token'] = 'a8dc9c473d0294fdaa38f4095c4964cdbe1ac7b8246982444133117e0301ee9e6bdad2ef325672be3215f';
        return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
        }

    function sendRequest(method, params, func) {
        $.ajax({
            url: getUrl(method,params),
            method: "GET",
            dataType: "JSONP",
            success: func
            });
        }

    function drawPosts(posts){
            var htmlFields = '';
            for(var i = 0; i < 5; i++){
                var post = posts[i];
                console.log(post);
                if(post.attachments[0]['photo']){
                    htmlFields += '<div class="mdl-grid mdl-cell mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp">\n' +
                        '          <div class="mdl-card__media mdl-cell  mdl-cell--3-col-desktop mdl-cell--hide-tablet mdl-cell--4-col-phone">\n' +
                        '            <img class="card_image" src="'+ post.attachments[0]['photo'].photo_604+'" alt="">\n' +
                        '          </div>\n' +
                        '          <div class="mdl-cell mdl-cell--8-col">\n' +
                        '            <h2 class="mdl-card__title-text">Features</h2>\n' +
                        '            <div class="mdl-card__menu">\n' +
                        '              <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">\n' +
                        '                <i class="material-icons">share</i></button>\n' +
                        '            </div>\n' +
                        '            <div class="mdl-card__supporting-text no-left-padding">\n' +
                        '              <p>' +post.text.slice(0,400)+'...' +'</p>\n' +
                        '              <span>Category: <a href="#">Latest</a></span>\n' +
                        '            </div>\n' +
                        '            <div style="text-align: right;" class="mdl-card__actions mdl-card--border">\n' +
                        '              <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">\n' +
                        '                Read more</a>\n' +
                        '            </div>\n' +
                        '          </div>\n' +
                        '        </div>';

                }
                if(post.attachments[0]['video']){
                    htmlFields += '<div class="mdl-grid mdl-cell mdl-cell mdl-cell--12-col-desktop mdl-cell--9-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--4dp">\n' +
                        '          <div class="mdl-card__media mdl-cell  mdl-cell--3-col-desktop mdl-cell--hide-tablet mdl-cell--4-col-phone">\n' +
                        '            <img class="card_image" src="'+ post.attachments[0]['video'].photo_640+'" alt="">\n' +
                        '          </div>\n' +
                        '          <div class="mdl-cell mdl-cell--8-col">\n' +
                        '            <h2 class="mdl-card__title-text">Features</h2>\n' +
                        '            <div class="mdl-card__menu">\n' +
                        '              <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">\n' +
                        '                <i class="material-icons">share</i></button>\n' +
                        '            </div>\n' +
                        '            <div class="mdl-card__supporting-text no-left-padding">\n' +
                        '              <p>' +post.text.slice(0,400)+'...' +'</p>\n' +
                        '              <span>Category: <a href="#">Latest</a></span>\n' +
                        '            </div>\n' +
                        '            <div style="text-align: right;" class="mdl-card__actions mdl-card--border">\n' +
                        '              <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">\n' +
                        '                Read more</a>\n' +
                        '            </div>\n' +
                        '          </div>\n' +
                        '        </div>';

                }

            }
            $('.page-content').append(htmlFields);

        }

    function onStart() {
           sendRequest("wall.get", {owner_id:-179220995, fields: 'photo_500'}, function (data) {
               console.log(data);
               drawPosts(data.response.items);
           });
        }
