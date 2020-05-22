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
  }, {
    title: '2020/05',
    dir: '/diary/2020-05'
  }]
}]

const nav = navMetadata.map(a => ({
  text: a.text,
  link: a.link
}))

module.exports = {
  nav,
  navMetadata
}
