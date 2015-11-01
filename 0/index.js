window.onload = function () {
    potofu2.setTitle(
        "daiz's portfolio",
        "daiz",
        "MacBookとChromebookでおもしろいものをつくりたい。"
    );

    var osusume_entries = potofu2.makeList('おすすめ記事', 'table', [
        1, 2, 3, 4, 5, 37, 43
    ]);

    var teian = potofu2.makeList('提案', 'table', [
        5, 3, 2, 21, 27
    ]);

    var tools = potofu2.makeList('便利なツール', 'table', [
        22, 17, 18, 20, 33, 26, 38, 31
    ]);

    var android = potofu2.makeList('Androidアプリ', 'appcard', [
        7, 8
    ]);

    var chromeapp = potofu2.makeList('Chromeアプリ・拡張機能', 'appcard', [
        11, 15, 10, 14, 13, 12, 34
    ]);

    var polymer = potofu2.makeList('Polymer芸', 'table', [
        19, 32
    ]);

    var sandbox = potofu2.makeList('いろいろ', 'table', [
        25, 29, 12, 26, 34, 35, 36
    ]);

    var hr = potofu2.hr(3);

    var debut = potofu2.makeList('デビュー作', 'table', [
        30
    ]);

    var jobs = potofu2.makeList('携わった製品', 'table', [
        42, 39, 40, 41
    ]);

    potofu2.pour([
        osusume_entries,
        teian,
        hr, jobs, hr,
        chromeapp,
        tools,
        android,
        polymer,
        sandbox,
        debut
    ]);

    potofu2.flush();
}

window.resize = function () {
}
