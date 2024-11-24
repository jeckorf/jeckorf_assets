"use strict";
// 检查浏览器是否支持Service Worker并进行注册
if (navigator.serviceWorker != null) {
  navigator.serviceWorker.register('/music/sw.js')
    .then(function (registartion) {
    }).catch(function (err) {
      console.log('fail');
    });
}

// 从URL查询参数中获取指定参数的值
function getQueryParam(param) {
  var searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

function updateHistoryState(title, url) {
  window.history && window.history.pushState && window.history.pushState(null, title, url);
}

function getBaseUrl() {
  return window.location.href.split("?")[0];
}

window.onload = function () {
  var name = getQueryParam("name");
  var id = getQueryParam("id");
  var url = getQueryParam("url");
  var type = getQueryParam("type");
  var inputElement = document.getElementById("j-input");
  var typeElement = document.getElementById("j-type");
  var navElement = document.getElementById("j-nav");
  var msgAlert = document.getElementById("msg-alert");

  // 根据获取到的参数初始化页面元素状态
  if (name || id) {
    inputElement.value = name || id;
    if (name) {
      // 触发对应导航栏按名称筛选的点击逻辑（这里假设相关元素有对应的事件绑定函数等，可能需要进一步完善）
      document.querySelector('#j-nav [data-filter="name"]').click();
    } else {
      document.querySelector('#j-nav [data-filter="id"]').click();
    }
  }
  if (url) {
    typeElement.style.display = "none";
    inputElement.value = url;
    document.querySelector('#j-nav [data-filter="url"]').click();
  }

  // 处理导航栏点击事件
  navElement.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
      var filter = event.target.dataset.filter;
      var placeholders = {
        name: "例如: Manta Lexie Liu",
        id: "例如: 25906124",
        url: "例如: http://music.163.com/#/song?id=25906124",
        pattern_name: "^.+$",
        pattern_id: "^[\\w\\/\\|]+$",
        pattern_url: "^https?:\\/\\/\\S+$"
      };
      // 切换导航栏选中状态
      var allLi = navElement.querySelectorAll("li");
      allLi.forEach(function (li) {
        li.classList.toggle("active", li === event.target);
      });
      // 更新输入框相关属性
      inputElement.dataset.filter = filter;
      inputElement.placeholder = placeholders[filter];
      inputElement.pattern = placeholders["pattern_" + filter];
      inputElement.classList.remove("am-field-valid", "am-field-error", "active");
      inputElement.closest(".form-group").classList.remove("am-form-success", "am-form-error");
      msgAlert.style.display = "none";
      if (filter === "url") {
        typeElement.style.display = "none";
      } else {
        typeElement.style.display = "block";
      }
    }
  });

  // 处理表单提交事件
  document.getElementById("j-submit").addEventListener("click", function (event) {
    event.preventDefault();
    var inputValue = inputElement.value.trim();
    var filter = inputElement.dataset.filter;
    var musicType = "url" === filter ? "_" : document.querySelector('input[name="music_type"]:checked').value;
    var isFormValid = false;
    // 根据不同的筛选条件进行输入值验证
    switch (filter) {
      case "name":
        isFormValid = /^.+$/.test(inputValue);
        break;
      case "id":
        isFormValid = /^[\\w\\/\\|]+$/.test(inputValue);
        break;
      case "url":
        isFormValid = /^https?:\/\/\S+$/.test(inputValue);
        break;
    }
    if (isFormValid) {
      var baseUrl = getBaseUrl();
      var ajaxOptions = {
        method: "POST",
        url: baseUrl,
        timeout: 30000,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: inputValue,
          filter: filter,
          type: musicType,
          page: 1
        })
      };
      // 发起AJAX请求，这里使用原生的fetch API示例，也可以使用XMLHttpRequest等其他方式
      fetch(ajaxOptions.url, ajaxOptions)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.code === 200 && data.data) {
            // 处理请求成功后的数据展示、音乐播放等逻辑，以下部分与原代码类似，可能需要进一步完善和调整
            console.log("111111");
            data.data.forEach(function (t) {
              t.title = t.title || "暂无";
              t.author = t.author || "暂无";
              t.pic = t.pic || "static/img/nopic.jpg";
              t.lrc = t.lrc || "[00:00.00] 暂无歌词";
              if (!/\[00:(\d{2})\./.test(t.lrc)) {
                t.lrc = "[00:00.00] 无效歌词";
              }
            });
            // 以下省略部分数据展示、音乐播放等具体逻辑，可参考原代码进一步完善
          } else {
            msgAlert.innerHTML = data.error || "(°ー°〃) 服务器好像罢工了";
            msgAlert.style.display = "block";
          }
        })
        .catch(function (error) {
          console.error("请求出错:", error);
          msgAlert.innerHTML = "(°ー°〃) 出了点小问题，请重试";
          msgAlert.style.display = "block";
        });
    } else {
      var errorMessages = {
        name: '将 名称 和 作者 一起输入可提高匹配度，<a class="text-underline--dashed" data-toggle="modal" data-target="#help">点击查看帮助</a>',
        id: '输入有误，<a class="text-underline--dashed" data-toggle="modal" data-toggle="modal" data-target="#help">点击查看帮助</a>',
        url: '输入有误，<a class="text-underline--dashed" data-toggle="modal" data-target="#help">点击查看帮助</a>'
      };
      var errorMessage = errorMessages[filter];
      msgAlert.innerHTML = errorMessage;
      msgAlert.style.display = "block";
    }
  });

  // 处理输入框获取焦点事件
  document.querySelectorAll("#j-main input").forEach(function (input) {
    input.addEventListener("focus", function () {
      this.select();
    });
  });

  // 处理返回按钮点击事件
  document.getElementById("j-back").addEventListener("click", function () {
    // 这里假设存在对应的音乐播放实例等，进行暂停等操作，参考原代码进一步完善
    document.getElementById("j-validator").style.display = "block";
    document.getElementById("j-main").style.display = "none";
    document.getElementById("search-btn").classList.remove("col-12").addClass("col-auto");
    document.getElementById("search-input").style.display = "block";
    document.querySelectorAll("#j-main input").forEach(function (input) {
      input.value = "";
    });
    document.title = document.title;
  });
};