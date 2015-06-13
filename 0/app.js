var stage = document;

var daizapp = daizapp || {};

/* URL クエリ名 */
daizapp.queries = {
  "new": "default",
  "snippet": "article",
  "ca": "chromeapp",
  "aa": "androidapp",
  "tool": "tool",
  "other": "other",
  "lab": "lab",
  "future": "draft",
  "component": "component",
  "graduated": "outofsupport"
}

daizapp.setMenus = function(title) {
  var content_area = stage.querySelector('#template_menus');
  content_area.res = [];
  var menu_set = daizapp.titles;
  var icon_set = daizapp.icons;
  var keys = Object.keys(menu_set);
  var res = [];
  for(var n=0; n < keys.length; n++) {
    var m = {};
    m.id = keys[n];
    m.name = menu_set[keys[n]];
    if(m.id == title) {
      m.color = "#FF4080";
    }else {
      m.color = "#424242";
    }
    m.icon = icon_set[keys[n]];
    res.push(m);
  }
  content_area.menus = res;
}

function getScrollbarWidth() {
  var w = 0;
  var www = window.innerWidth;
  var ww = stage.querySelector('.content').clientWidth;
  w = www - ww;
  return w;
}

function getCards(title) {
  var cards = daizapp.cards;
  var res = [];
  for(var j=0; j < cards.length; j++) {
    var card = cards[j];
    var tags = card.tag;
    for(var t=0; t<tags.length; t++) {
      if(tags[t] == title) res.push(card.body);
    }
  }
  return res;
}

daizapp.setCards = function(title) {
  var cards = getCards(title);
  var color = daizapp.colors[title];
  var pagetitle = daizapp.titles[title];

  var content_area = stage.querySelector('#template_cards');
  var toolbar = stage.querySelector('.tall');
  var title_area = stage.querySelector(".pagetitle");
  var menuicon = stage.querySelector("#btn_menu");

  title_area.style.color = color[3];
  menuicon.style.color = color[3];
  title_area.innerHTML = pagetitle;
  toolbar.style.backgroundColor = color[1];
  var sw = getScrollbarWidth();
  var res = [];
  var card_styles = getFlexibleWidth(1, [6, 6], window.innerWidth - sw, 200, 580);
  for(var i=0; i < cards.length; i++) {
    var record = cards[i];
    var item = {};
    /* カード台紙のスタイル */
    item.width = card_styles[0];
    item.ml = card_styles[1];
    item.mr = card_styles[2];
    /* スクリーンショットエリアのスタイル */
    item.imgh = item.width * (900 / 1400);
    item.bgcolor = color[2];
    stage.querySelector("#headcolor").content = color[0];
    /* カードの中身 */
    item.links = record.links;
    item.dh = item.imgh / 2.2;
    item.id = i;
    item.title = record.title || "未定";
    item.description = record.d;
    if(record.image != undefined) {
      item.imgtag = record.image;
      item.show_img = 'block';
    }else {
      item.show_img = 'none';
    }
    /* ツールボタン設定 */
    var btns = ["page", "github", "article", "more"];
    for(var b=0; b < btns.length; b++) {
      item["show_" + btns[b]] = (record.links[btns[b]] == undefined) ? "none" : "inline-block";
    }
    res.push(item);
  }
  content_area.cards = res;
}

daizapp.getURLqs = function() {
  var url = window.location.href;
  var queries = url.split('?')[1];
  if(queries != undefined) {
    queries = queries.replace('/', '').split('&');
  }else {
    return {"o": "default"};
  }
  var res = {};
  for(var w=0; w < queries.length; w++) {
    var q = queries[w];
    var name = q.split("=")[0];
    var val = q.split("=")[1];
    /* o-対応 */
    if(name == "o") {
      val = daizapp.queries[val];
    }
    res[name] = val;
  }
  return res;
}

daizapp.windowopen = function(url) {
  window.open(url);
}


window.addEventListener('click', function(e) {
  var id = e.target.id;
  var id_type = id.split('_')[0];
  var id_val = id.split('_')[1];
  var d = stage.querySelector('#drawer');
  if(id == 'btn_menu') {
    d.openDrawer();
  }
  else if(id_type == "menu") {
    daizapp.setMenus(id_val);
    daizapp.setCards(id_val);
    d.closeDrawer();
  }
  else if(id_type == "toolbtn") {
    var fn = id_val.split("-")[0];
    var num = id_val.split("-")[1];
    var cards = stage.querySelector('#template_cards').cards;
    daizapp.windowopen(cards[num].links[fn]);
  }
}, false);


function getcontents(json) {
  daizapp.cards = json.cards;
  daizapp.colors = json.colors;
  daizapp.icons = json.icons;
  daizapp.titles = json.titles;

  var qs = daizapp.getURLqs();
  var title = qs.o || "default";
  daizapp.setMenus(title);
  daizapp.setCards(title);
}


window.addEventListener('load', function(e) {
  getcontents(data);
}, false);
