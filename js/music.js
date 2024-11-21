"use strict";
if(navigator.serviceWorker != null){
  navigator.serviceWorker.register('/music/sw.js')
  .then(function(registartion){
  }).catch(function (err){
    console.log('fail')
  });
}
$(function() {
  function t(t) {
    var a = null,
      e = [];
    return location.search.substr(1).split("&").forEach(function(i) {
      e = i.split("="), e[0] === t && (a = decodeURIComponent(e[1]))
    }), a
  }
  function a(t, a) {
    window.history && window.history.pushState && window.history.pushState(null, t, a)
  }

  function e(t) {
    var a = location.href.split("?")[0];
    return t ? a + t : a
  }
  var i = null,
    n = [],
    l = "static/img/nopic.jpg",
    r = t("name"),
    o = t("id"),
    s = t("url"),
    c = t("type"),
    d = document.title;
  (r || o) && c && setTimeout(function() {
    $("#j-input").val(r || o), $('#j-type input[value="' + c + '"]').prop("checked", !0), r && $('#j-nav [data-filter="name"]').trigger("click"), o && $('#j-nav [data-filter="id"]').trigger("click"), $("#j-validator").trigger("submit")
  }, 0), s && setTimeout(function() {
    $("#j-type").hide(), $("#j-input").val(s), $('#j-nav [data-filter="url"]').trigger("click"), $("#j-validator").trigger("submit")
  }, 0), $("#j-nav").on("click", "li", function() {
    var t = {
        name: "例如: Manta Lexie Liu",
        id: "例如: 25906124",
        url: "例如: http://music.163.com/#/song?id=25906124",
        pattern_name: "^.+$",
        pattern_id: "^[\\w\\/\\|]+$",
        pattern_url: "^https?:\\/\\/\\S+$"
      },
      a = $(this).data("filter");
    $(this).addClass("active").siblings("li").removeClass("active"), $("#j-input").data("filter", a).attr({
      placeholder: t[a],
      pattern: t["pattern_" + a]
    }).removeClass("am-field-valid am-field-error active").closest(".form-group").removeClass("am-form-success am-form-error"), $("#msg-alert").hide(), "url" === a ? $("#j-type").hide() : $("#j-type").show()
  }), $("#j-validator").validator({
    onValid: function(t) {
      $("#msg-alert").hide()
    },
    onInValid: function(t) {
      var a = $(t.field),
        e = {
          name: '将 名称 和 作者 一起输入可提高匹配度，<a class="text-underline--dashed" data-toggle="modal" data-target="#help">点击查看帮助</a>',
          id: '输入有误，<a class="text-underline--dashed" data-toggle="modal" data-target="#help">点击查看帮助</a>',
          url: '输入有误，<a class="text-underline--dashed" data-toggle="modal" data-target="#help">点击查看帮助</a>'
        },
        i = document.getElementById("msg-alert"),
        n = e[a.data("filter")] || this.getValidationMessage(t);
      i.length || ($("#msg-alert").html(n).show(), $("#search-btn").removeClass("col-12").addClass("col-auto"), $("#search-input").css("display", "block"))
    },
    submit: function(t) {
      if (t.preventDefault(), this.isFormValid()) {
        var r = $.trim($("#j-input").val()),
          o = $("#j-input").data("filter"),
          s = "url" === o ? "_" : $('input[name="music_type"]:checked').val(),
          c = $('<div class="aplayer-more">载入更多</div>'),
          u = !1;
        ! function t(r, o, s, p) {
          $.ajax({
            type: "POST",
            url: e(),
            timeout: 3e4,
            data: {
              input: r,
              filter: o,
              type: s,
              page: p
            },
            dataType: "json",
            beforeSend: function() {
              u = !0;
              var t = document.title;
              switch (o) {
                case "name":
                  a(t, e("?name=" + r + "&type=" + s));
                  break;
                case "id":
                  a(t, e("?id=" + r + "&type=" + s));
                  break;
                case "url":
                  a(t, e("?url=" + encodeURIComponent(r)))
              }
              1 === p ? ($("#j-input").attr("disabled", !0), $("#j-submit").button("loading"), $("#search-btn").addClass("col-12"), $("#search-input").css("display", "none")) : c.text("请稍后...")
            },
            success: function(a) {
              if (200 === a.code && a.data) {
                a.data.map(function(t) {
                  t.title || (t.title = "暂无"), t.author || (t.author = "暂无"), t.pic || (t.pic = l), t.lrc || (t.lrc = "[00:00.00] 暂无歌词"), /\[00:(\d{2})\./.test(t.lrc) || (t.lrc = "[00:00.00] 无效歌词")
                });
                var e = function(t) {
                  if ($("#j-link").val(t.link), $("#j-link-btn").attr("href", t.link), $("#j-src").val(t.url), $("#j-src-btn").attr("href", t.url), $("#j-lrc").val(t.lrc), $("#j-lrc-btn").attr("href", "data:application/octet-stream;base64," + btoa(unescape(encodeURIComponent(t.lrc)))), "download" in $("#j-src-btn")[0]) {
                    var a = t.title + "-" + t.author;
                    $("#j-src-btn").attr("download", a + ".mp3"), $("#j-lrc-btn").attr("download", a + ".lrc"), $("#j-src-btn-icon, #j-lrc-btn-icon").addClass("am-icon-download").removeClass("am-icon-external-link")
                  }
                  $("#j-songid").val(t.songid), $("#j-name").val(t.title), $("#j-author").val(t.author)
                };
                1 === p ? (i && i.pause(), n = a.data, e(n[0]), $("#j-validator").slideUp(), $("#j-main").slideDown(), i = new APlayer({
                  element: $("#j-player")[0],
                  autoplay: !1,
                  narrow: !1,
                  showlrc: 1,
                  mutex: !1,
                  mode: "circulation",
                  preload: "metadata",
                  theme: "#0e90d2",
                  music: a.data
                }), $("#j-player").append(c), c.on("click", function() {
                  u || (p++, t(r, o, s, p))
                })) : (i.addMusic(a.data), n = n.concat(a.data)), i.on("canplay", function() {
                  i.play()
                }), i.on("play", function() {
                  var t = n[i.playIndex],
                    a = new Image;
                  a.src = t.pic, a.onerror = function() {
                    $(".aplayer-pic").css("background-image", "url(" + l + ")")
                  }, document.title = "正在播放: " + t.title + " - " + t.author, e(t)
                }), i.on("ended", function() {
                  document.title = d
                }), a.data.length < 10 ? c.hide() : c.text("载入更多")
              } else 1 === p ? ($("#msg-alert").html(a.error || "(°ー°〃) 服务器好像罢工了").show(), $("#search-btn").removeClass("col-12").addClass("col-auto"), $("#search-input").css("display", "block")) : (c.text("没有了"), setTimeout(function() {
                c.slideUp()
              }, 1e3))
            },
            error: function(t, a) {
              if (1 === p) {
                var e = "(°ー°〃) 出了点小问题，请重试";
                "timeout" === a && (e = "(°ー°〃) 请求超时了，请稍后重试"), $("#msg-alert").html(e).show(), $("#search-btn").removeClass("col-12").addClass("col-auto"), $("#search-input").css("display", "block")
              } else c.text("(°ー°〃) 加载失败了，点击重试")
            },
            complete: function() {
              u = !1, 1 === p && ($("#j-input").attr("disabled", !1), $("#j-submit").button("reset"))
            }
          })
        }(r, o, s, 1)
      }
    }
  }), $("#j-main input").focus(function() {
    $(this).select()
  }), $("#j-back").on("click", function() {
    i && i.pause(), $("#j-validator").slideDown(), $("#j-main").slideUp(), $("#search-btn").removeClass("col-12").addClass("col-auto"), $("#search-input").css("display", "block"), $("#j-main input").val(""), document.title = d
  })
});
