var header =
  ' <header class="mdl-layout__header mdl-color--red-600">\n' +
  '   <div class="mdl-layout__header-row">\n' +
  '     <div class="mdl-layout-spacer"></div>\n' +
  '       <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">\n' +
  '         <label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">\n' +
  '           <i class="material-icons">search</i>\n' +
  '         </label>\n' +
  '         <div class="mdl-textfield__expandable-holder">\n' +
  '           <input class="mdl-textfield__input" type="text" name="sample" id="fixed-header-drawer-exp">\n' +
  '         </div>\n' +
  '       </div>\n' +
  '     </div>\n' +
  ' </header>\n';

var drawer =
  ' <div class="mdl-layout__drawer">\n' +
  '   <span class="mdl-layout-title">AFN</span>\n' +
  '   <nav class="mdl-navigation">\n' +
  '     <a class="mdl-navigation__link" href="">Link</a>\n' +
  '     <a class="mdl-navigation__link" href="">Link</a>\n' +
  '     <a class="mdl-navigation__link" href="">Link</a>\n' +
  '     <a class="mdl-navigation__link" href="">Link</a>\n' +
  '     <a class="mdl-navigation__link" href="">Link</a>\n' +
  '     <a class="mdl-navigation__link" href="">Link</a>\n' +
  '     <a class="mdl-navigation__link" href="">Link</a>\n' +
  '   </nav>\n' +
  ' </div>\n';

var footer =
  ' <footer class="mdl-mini-footer mdl-color--grey-900">\n' +
  '   <div class="mdl-mini-footer__left-section">\n' +
  '     <div class="mdl-logo">News Portal</div>\n' +
  '       <ul class="mdl-mini-footer__link-list">\n' +
  '         <li><a href="#">Link</a></li>\n' +
  '         <li><a href="#">Link</a></li>\n' +
  '         <li><a href="#">Link</a></li>\n' +
  '         <li><a href="#">Link</a></li>\n' +
  '         <li><a href="#">Link</a></li>\n' +
  '         <li><a href="#">Link</a></li>\n' +
  '       </ul>\n' +
  '     </div>\n' +
  '   </div>\n' +
  ' </footer>\n';


$(".mdl-layout").prepend(header);
$(drawer).insertAfter("header");
$(".mdl-layout__content").append(footer);