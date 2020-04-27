const navMetadata = [{
  text: 'Blog',
  link: '/blog/',
  sideDirList: [{
    title: '随笔',
    dir: '/blog/article'
  }, {
    title: 'mapbox-gl',
    dir: '/blog/mapbox'
  }, {
    title: '面试题',
    dir: '/blog/interview'
  }]
}, {
  text: '每日随笔',
  link: '/diary/',
  sideDirList: [{
    title: '2020/04',
    dir: '/diary/2020-04'
  }]
}]

const nav = navMetadata.map(a => ({
  text: a.text,
  link: a.link
}))

console.log('nav', nav)

module.exports = {
  nav,
  navMetadata
}
