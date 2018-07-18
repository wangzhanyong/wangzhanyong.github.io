const cacheList = ["2017/03/07/React组件生命周期/index.html","2017/03/08/React Element、Component和ReactClass的概念/index.html","2017/03/09/React中的“虫洞”——Context/index.html","2017/03/28/Web中的坐标系/index.html","2017/04/06/Canvas最佳实践（性能篇）/index.html","2017/04/06/常用git命令/index.html","2017/04/12/Canvas基础图形与动画/index.html","2017/04/12/Mac下brew安装Nginx及使用/index.html","2017/04/13/Canvas图像处理/index.html","2017/04/13/Canvas图片下载/index.html","2017/04/13/H5图片上传本地预览/index.html","2017/04/20/Curl调试restful接口/index.html","2017/04/23/前端单元测试/index.html","2017/06/05/Javascript递归遍历树/index.html","2018/06/26/ChromeDevtoolTiming/index.html","2018/06/26/Chrome调试远程设备白屏解决办法/index.html","2018/06/26/Nginx正则/index.html","2018/06/26/Webpack异步ChunkName/index.html","2018/06/26/WhyOPTIONS/index.html","2018/06/26/filters/index.html","2018/06/26/浏览器缓存/index.html","2018/07/01/ReactiveData/index.html","2018/07/10/SSE/index.html","2018/07/10/longPolling/index.html","2018/07/11/Vue-cli项目css背景图路径问题/index.html","2018/07/11/eventPassiveMode/index.html","2018/07/11/localStorage存储/index.html","2018/07/11/对象复制/index.html","2018/07/11/按位非/index.html","about/index.html","archives/2017/03/index.html","archives/2017/04/index.html","archives/2017/06/index.html","archives/2017/index.html","archives/2017/page/2/index.html","archives/2018/06/index.html","archives/2018/07/index.html","archives/2018/index.html","archives/2018/page/2/index.html","archives/index.html","archives/page/2/index.html","archives/page/3/index.html","css/style.css","images/Cartesian-coordinate-system-with-circle.svg.png","images/Cartesiancoordinatesystem.png","images/web.png","img/client.jpg","img/favicon.png","img/scrollbar_arrow.png","index.html","js/GithubRepoWidget.js","js/instagram.js","js/main.js","js/mobile.js","js/pc.js","js/search.js","js/toc.js","page/2/index.html","page/3/index.html","tags/CSS/index.html","tags/Canvas/index.html","tags/Git/index.html","tags/H5/index.html","tags/HTTP/index.html","tags/Javascript/index.html","tags/Other/index.html","tags/React/index.html","tags/Vue/index.html","tags/Webpack/index.html","tags/index.html"]
const cacheKey = 'hexo-cache-v201807181509'

const ignoreRequestKeywords = ["google","baidu"]

const matchOptions = {
  ignoreSearch: true,
  ignoreMethod: true,
  ignoreVary: true
}
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheKey)
      .then(function (cache) {
        return cache.addAll(cacheList)
      })
      .then(() => {
        self.skipWaiting()
      })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      Promise.all(keys.map(function (key) {
        if (key !== cacheKey) {
          return caches.delete(key)
        }
      }))
        .then(() => {
          self.clients.claim()
        })
    })
  )
})

const isIgnore = (request) => {
  if (request.method !== 'GET') return true
  ignoreRequestKeywords.some(keyword => {
    if (request.url.includes(keyword)) return true
  })
  return false
}

self.addEventListener('fetch', function (event) {
  if (isIgnore(event.request)) return fetch(event.request)
  event.respondWith(
    caches.match(event.request, matchOptions)
      .then(function (response) {
        if (response) {
          return response
        }
        throw Error('go catch')
      })
      .catch(()=> {
        var requestClone = event.request.clone() // 把原始请求拷过来
        return fetch(requestClone).then(function (httpRes) {
          if (httpRes.status !== 200) {
            return httpRes
          }
          var responseClone = httpRes.clone()
          caches.open(cacheKey).then(function (cache) {
            cache.put(event.request, responseClone)
          })
          return httpRes
        })
      })
  )
})
