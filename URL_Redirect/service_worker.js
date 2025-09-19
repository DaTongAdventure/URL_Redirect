'use strict'

// 注意： 反向代理服务需要放开 CORS 限制



// 全局变量定义用 var ，局部变量用 let 或 const 

// 启用那个代理配置，应用A:geb, 应用B:gbvs, 应用C:rwdb
var enableConfig = "geb"

if ("geb" === enableConfig) {
  // ************************ start 编标配置编辑区 ********************************
  // 会话Cookie，<按需修改>
  var sessionCookieName = "G3_SESSION_V"
  // 真实客户端IP，<按需修改>
  var realIp = "XXX.XXX.XXX.XXX"

  // 需要转发的原始 schema
  var originSchema = 'http'
  // 需要转发的原始域名，<按需修改>
  var originDomain = "XXX.XXXX.com"
  // 需要转发的原始 cookie 中使用的url
  var originCookieUrl = originSchema + "://" + originDomain
  // location，nginx中额外多加的 location url
  var originLocation = "/xxxapi"

  // 需要转发的原始 schema
  var proxySchema = 'http'
  // 反向代理的域名，<按需修改>
  var proxyDomain = "127.0.0.1"

  // ************* 代理 xxx-app *************
  // 反向代理的端口，<按需修改>
  var proxyPort = "18081"
  // 应用上下文，<按需修改>
  var appContext = "/tender-ty"



  // 反向代理的 cookie 中使用的url
  var proxyCookieUrl = proxySchema + "://" + proxyDomain + ':' + proxyPort


  // ------------------ start 规则相关 ------------------------------ 
  /*
   redirectRuleRegexFilter 和 redirectRuleRegexSubstitution 指定的是 
   如将 http://XXX.XXX.com/XXX/xxx 重定向转发到 http://127.0.0.1:18081/XXX/xxx 中,
   默认 xxx 的值是 .* , 即所有请求，xxx 可按需调整成特定的正则表达式，如单个请求
  */

  // 转发规则中，匹配到需要被重定向的 URL 规则（通配方式），<按需修改>
  var redirectRuleRegexFilter = "^" + originSchema + "://" + originDomain.replace(/\./g, "\\\.") + originLocation + appContext + "(.*)$"
  // 转发规则中，匹配到需要被重定向的 URL 规则（指定接口方式），<按需修改>
  // var redirectRuleRegexFilter = "^" + originSchema + "://" + originDomain.replace(/\./g, "\\\.") + originLocation + appContext + "(.*/evalmethod/tenderFileRecord/checkProject.*)$"

  // 转发规则中，原始URL被重定向的 URL 规则
  var redirectRuleRegexSubstitution = proxyCookieUrl + appContext + "\\1"

  // ************************ end 编标配置编辑区 ********************************
} else if ("gbvs" === enableConfig) {
  // ************************ start 编标配置编辑区 ********************************
  // 会话Cookie，<按需修改>
  var sessionCookieName = "SESSION"
  // 真实客户端IP，<按需修改>
  var realIp = "XXX.XXX.XXX.XXX"

  // 需要转发的原始 schema
  var originSchema = 'http'
  // 需要转发的原始域名，<按需修改>
  var originDomain = "XXX.XXX.XXX.XXX"
  // 需要转发的原始 cookie 中使用的url
  var originCookieUrl = originSchema + "://" + originDomain
  // location，nginx中额外多加的 location url
  var originLocation = "/xxxapi"

  // 需要转发的原始 schema
  var proxySchema = 'http'
  // 反向代理的域名，<按需修改>
  var proxyDomain = "127.0.0.1"

  // 反向代理的端口，<按需修改>
  var proxyPort = "16666"
  // 应用上下文，<按需修改>
  var appContext = ""


  // 反向代理的 cookie 中使用的url
  var proxyCookieUrl = proxySchema + "://" + proxyDomain + ':' + proxyPort


  // ------------------ start 规则相关 ------------------------------
  /*
   redirectRuleRegexFilter 和 redirectRuleRegexSubstitution 指定的是 
   如将 http://XXX.XXX.XXX.XXX/XXX/xxx 重定向转发到 http://127.0.0.1:16666/xxx 中,
   默认 xxx 的值是 .* , 即所有请求，xxx 可按需调整成特定的正则表达式，如单个请求
  */

  // 转发规则中，匹配到需要被重定向的 URL 规则（通配方式），<按需修改>
  var redirectRuleRegexFilter = "^" + originSchema + "://" + originDomain.replace(/\./g, "\\\.") + originLocation + appContext + "(.*)$"

  // 转发规则中，原始URL被重定向的 URL 规则
  var redirectRuleRegexSubstitution = proxyCookieUrl + appContext + "\\1"

  // ************************ end 编标配置编辑区 ********************************
} else if ("rwdb" === enableConfig) {
  // ************************ start 入围定标配置编辑区 ********************************

	//可自行拓展

  // ************************ end 入围定标配置编辑区 ********************************
}


// ************************ 以下是通用区域，不需要修改 *****************************

// 添加 cookie 的规则中，需要为反向代理添加 cookie 的 URL 规则
var cookieRuleUrlFilter = proxySchema + "://" + proxyDomain + '*'
// ------------------ end 规则相关 ------------------------------

// ------------------ 打印规则信息 ------------------------------
function printRules(ruleIds, dynamic) {
  if (dynamic) {
    chrome.declarativeNetRequest.getDynamicRules(
      {
        ruleIds: ruleIds
      },
      function(rules) {
        console.log("DynamicRules:" + JSON.stringify(rules))
      }
    )
  }
}

// ------------------ 设置 动态规则
function updateDynamicRules(cookieValue) {
  // session 等 header 需要动态更新的规则
  // UpdateRuleOptions 参数官网说明: https://developer.chrome.google.cn/docs/extensions/reference/api/declarativeNetRequest?authuser=3#type-UpdateRuleOptions
  var updateRuleOptions = {
    removeRuleIds: [1, 2],
    addRules: [
      // 转发规则
      {
        id: 1,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            regexSubstitution: redirectRuleRegexSubstitution
          }
        },
        condition: {
          regexFilter: redirectRuleRegexFilter,
          resourceTypes: [
            "main_frame",
            "sub_frame",
            "xmlhttprequest"
          ]
        }
      },
      // 添加 cookie 的规则
      {
        id: 2,
        priority: 10,
        condition: {
          urlFilter: cookieRuleUrlFilter,
          resourceTypes: [
            'main_frame',
            'sub_frame',
            'xmlhttprequest'
          ]
        },
        action: {
          type: 'modifyHeaders',
          // 修改请求头
          requestHeaders: [
            {
              operation: 'set',
              header: 'Cookie',
              value: sessionCookieName + '=' + cookieValue
            },
            {
              operation: 'set',
              header: 'Referer',
              value: proxyCookieUrl
            },
            {
              operation: 'set',
              header: 'X-Real-IP',
              value: realIp
            },
            // // 不要设置这个，否则会被跨域拦截器拦截，org.springframework.web.cors.DefaultCorsProcessor
            // {
            //   operation: 'set',
            //   header: 'Origin',
            //   value: proxyCookieUrl
            // }
          ],
          // 修改响应头，处理跨域CROS问题，同时服务端也需要做跨域支持
          responseHeaders: [
            // CSP 处理跨域 CROS
            {
              operation: 'set', 
              header: 'Content-Security-Policy', 
              value: ''
            }
          ]
        }
      }
    ]
  }

  console.log('updateRuleOptions:' + JSON.stringify(updateRuleOptions))

  // 更新动态规则（推荐使用），用于设置cookie, 用于 chrome 插件规则
  chrome.declarativeNetRequest.updateDynamicRules(
    updateRuleOptions,
    function() {
        console.log('Updated Cookie Rule.');
    })
}


// ------------------ 设置 反向代理服务使用的 cookie
function setProxyCookie(cookie) {
  // 获取 chrome 中反向代理服务使用的会话 cookie 是否一致
  chrome.cookies.get(
    // CookieDetails
    {name: sessionCookieName, url: proxyCookieUrl},
    (proxyCookie) => {
      // console.log("Proxy cookie:" + JSON.stringify(proxyCookie));
      // 会话cookie不一致，则更新
      if (proxyCookie && cookie.value != proxyCookie.value) {
        const proxyCookie = {"url": proxyCookieUrl, "httpOnly":true, "name":sessionCookieName, "path":"/", "value":cookie.value}
        console.log("Set Proxy Cookie:" + JSON.stringify(proxyCookie));
        // 用于 chrome 浏览器页面直接访问，
        chrome.cookies.set(proxyCookie)
      }
    }
  );
  // session 等 header 需要动态更新的规则
  updateDynamicRules(cookie.value);
};


console.log("cookie:" + sessionCookieName + ", url:" + JSON.stringify(originCookieUrl))

// ------------------ 获取cookie ------------------
chrome.cookies.get(
  // CookieDetails
  {name: sessionCookieName, url: originCookieUrl},
  (cookie) => {
    console.log("Get cookie:" + JSON.stringify(cookie))
    // cookie 不为空
    if (cookie) {
      setProxyCookie(cookie)
    } else {
        // 设置动态规则
        updateDynamicRules('');
    }
  }
)


// ------------------ cookie 变动处理 ------------------
chrome.cookies.onChanged.addListener(
  (changeInfo) => {
      // console.log("cookie changed, changeInfo:" + JSON.stringify(changeInfo));
    // 源域名的cookie变动时触发
    if (originDomain.indexOf(changeInfo.cookie.domain) && changeInfo.cookie.name == sessionCookieName) {
      // console.log("origin cookie "+sessionCookieName+" changed, changeInfo:" + JSON.stringify(changeInfo))
      if (!changeInfo.removed) {
        if (changeInfo.cookie.name == sessionCookieName && changeInfo.cookie.domain != proxyDomain) {
          setProxyCookie(changeInfo.cookie)
        }
      }
    }
  })



// ------------------ 测试命中的规则用例 ------------------------------
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  const msg = `Navigation to ${e.request.url} redirected on tab ${e.request.tabId}.`
  console.log(msg)
  // debugger
  printRules([e.rule.ruleId], "_dynamic" == e.rule.rulesetId || "_session" == e.rule.rulesetId)
})



console.log('Service worker started.')