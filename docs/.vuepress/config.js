const { readdirSync } = require('fs')
const { resolve } = require('path')
const { nav, navMetadata } = require('./utils/nav')
module.exports = ctx => ({
  title: 'LiYajie',
  description: 'LiYajie技术小栈',
  themeConfig: {
    locales: {
      '/': {
        nav: [{
          text: 'Home', link: '/'
        }, ...nav],
        sidebar: getSidebar(),
        smoothScroll: true
      }
    }
  }
})

function getSidebarChildren(dir) {
  return readdirSync(resolve(__dirname, '..' + dir))
    .map(filename => dir + '/' + filename.slice(0, -3))
    .sort()
}

function getSidebar() {
  const sidebar = {}
  navMetadata.forEach(item => {
    const s = item.sideDirList.map(side => {
      return {
        title: side.title,
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: getSidebarChildren(side.dir)
      }
    })
    sidebar[item.link] = s
  })
  return sidebar
}
