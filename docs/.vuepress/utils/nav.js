const navMetadata = [{
  text: 'Blog',
  link: '/blog/',
  sideDirList: [{
    title: '面试',
    dir: '/blog/interview'
  }, {
    title: 'JS基础',
    dir: '/blog/js'
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
