/*
 * ポートフォリオ作成ライブラリ Potofu2
 * (C) daiz
 */

 /* CSV規則
  * 0. title
  * 1. product_uri: アプリダウンロードサイトやデモページのURI
  * 2. about_uri  : アプリの説明ページやリリース記事のURI
  * 3. labels     : ラベル
  * 4. icon_uri   : アイコン画像のURI
  * 5. short_text : ひとこと
  * 6. languages  : 主なプログラミング言語
  * 7. products   : 関連プロダクト名
  *
  * 記法
  * 1... 1番目の要素（必須） 仮置きは`?`
  * 2... 2番目の要素（必須） 仮置きは`?`
  * 3... `#`で開始する
  * 4... `!`で開始する
  * 5... `>`で開始する
  * 6... `@`で開始する
  * 7... `+`で開始する
  */

String.prototype.format = function() {
  var str = this.toString();
  var args = arguments;
  var len_blanks = (str.match(/\{\}/g) || []).length;
  var len_args = args.length;
  if(len_args != len_blanks) return str;
  for(var i=0; i < args.length; i++) {
    str = str.replace(/\{\}/, args[i]);
  }
  return str;
}

var potofu2 = {
    /* CSVでの変数 */
    C: {
        blog: 'http://daiiz.hatenablog.com/entry',
        cate: 'http://daiiz.hatenablog.com/archive/category',
        gh  : 'https://github.com',
        play: 'https://play.google.com/store/apps/details?id',
        cws : 'https://chrome.google.com/webstore/detail'
    },

    makeList: function (title, type, contentIds) {
        var title = '<h1>{}</h1>'.format(title);
        var content = '';
        var stage = '';
        if (type === 'table') {
            content = this._makeTableList(contentIds);
            stage = '<div class="stage_table">{}{}</div>'.format(title, content);
        }else if (type == 'appcard') {
            content = this._makeAppCardList(contentIds);
            stage = '<div class="stage_appcard">{}{}</div>'.format(title, content);
        }
        return stage;
    },

    _makeAppCardList: function (contentIds) {
        var res = '<div class="apps">';
        for (var i = 0; i < contentIds.length; i++) {
            var id = contentIds[i];
            var c = works['work' + id];
            // 製品URI
            var product = this._solvesC(c.product_uri);
            // 紹介URI
            var about = this._solvesC(c.about_uri);
            var labels = this._getLabels(c.labels, about) + this._getLangLabels(c.languages);

            var a = '<div class="apptitle"><a href="{}" target="_blank" title="{}" class="appname">{}</a></div>'.format(about, c.title, c.title);
            var icon = '<center><img src="{}" class="appicon"></center>'.format(c.icon_uri || 'icons/seed-icon.png');
            var btn_getapp = '<a href="{}" target="_blank" class="getapp_a"><div class="getapp">{}</div></a>'.format(product, '入手');
            var card = '<div class="appcard">{} {} <div class="applabels">{}</div>{}</div>'.format(a, icon, labels, btn_getapp);
            res += card;
        }
        return res + '</div>';
    },

    _makeTableList: function (contentIds) {
        var res = '';
        for (var i = 0; i < contentIds.length; i++) {
            var id = contentIds[i];
            var c = works['work' + id];
            var uri = this._solvesC(c.product_uri);
            var labels = this._getLabels(c.labels, uri) + this._getLangLabels(c.languages);
            var a;
            if (uri === '?') {
                a = '<span class="no_uri_item">{}</span> {}'.format(c.title, labels);
            }else {
                a = '<a href="{}" target="_blank">{}</a> {}'.format(uri, c.title, labels);
            }
            var cl = (i % 2 === 0) ? 'tr_' : '_tr';
            var div = '<div class="{}">{}</div>'.format(cl, a);
            res += div;
        }
        return res;
    },

    _solvesC: function (uri) {
        var keys = Object.keys(this.C);
        var self = this;
        keys.forEach(function (key) {
            var pl = '$' + key;
            uri = uri.replace(pl, self.C[key]);
        });
        return uri;
    },

    _getLabels: function (labels, uri) {
        var res = '';
        labels.forEach(function (label) {
            if (label === 'hatebu') {
                // はてなブックマークラベルを取得する
                var hatebu = 'http://b.hatena.ne.jp/entry/image/' + uri;
                var tag = '<img src="{}">'.format(hatebu);
                res += tag;
            }else {
                var tag = '<div class="label">{}</div>'.format(label);
                res += tag;
            }
        });
        return res;
    },

    _getLangLabels: function (langs) {
        var res = '';
        langs.forEach(function (l) {
            var tag = '<div class="lang_label label">{}</div>'.format(l);
            res += tag;
        })
        return res;
    },

    makeListByLabels: function (labels, andor) {

    },

    flush: function () {
        var self = this;
        var stage_appcards = document.querySelectorAll('.stage_appcard');
        for (var i = 0; i < stage_appcards.length; i++) {
            var stage = stage_appcards[i];
            self._insertShadowAppCards(stage);
        }
    },

    _insertShadowAppCards: function (dom) {
        // ダミーカードを消去する
        var ds = dom.querySelectorAll('.appcard-shadow');
        for (var i = 0; i < ds.length; i++) {
            ds[i].outerHTML = '';
        }
        var w = dom.offsetWidth;
        var cardwidth = 225;
        // 一行に表示できるカードの数
        var num_in_row = Math.floor(w / cardwidth);
        // 最終行の表示中のカードの数
        var num_in_last_row = dom.querySelectorAll('.appcard').length % num_in_row;
        // ダミーカードを挿入してバランスを保つ
        var dummy_card = '<div class="appcard-shadow"></div>';
        var dummies = '';
        var dummy_length = num_in_row - num_in_last_row;
        if (num_in_last_row > 0) {
            for (var i = 0; i < dummy_length; i++) {
                dummies += dummy_card;
            }
        }
        dom.querySelector('.apps').innerHTML += dummies;
    },

    hr: function (num) {
        var res = '<div class="hr"><center>';
        var dot = '<div class="hr_dot"></div>'
        for (var i = 0; i < num; i++) {
            res += dot;
        }
        return res + '</center></div>';
    },

    setTitle: function (titleTag, pageTitle, subTitle) {
        document.querySelector('.head_title').innerHTML = pageTitle;
        document.querySelector('.head_message').innerHTML = subTitle;
        document.querySelector('title').innerHTML = titleTag;
    },

    pour: function (stagesHtml) {
        var res = '';
        stagesHtml.forEach(function (stage) {
            res += stage;
        });
        document.querySelector('#main').innerHTML = res;
    }

};
