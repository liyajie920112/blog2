const navMetadata = [{
  text: 'Blog',
  link: '/blog/',
  sideDirList: [{
    title: 'MapboxGl',
    dir: '/blog/mapbox'
  }, {
    title: '面试题',
    dir: '/blog/interview'
  }, {
    title: '文章',
    dir: '/blog/article'
  }]
}, {
  text: 'CSS',
  link: '/css/',
  sideDirList: [{
    title: 'CSS',
    dir: '/css/basis'
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
