const { readdirSync } = require('fs')
const { resolve } = require('path')
const { nav, navMetadata } = require('./utils/nav')
module.exports = ctx => {
  return {
    dest: 'dist',
    title: 'LiYajie',
    description: 'LiYajie技术小栈',
    themeConfig: {
      logo: '/images/logo.jpg',
      locales: {
        '/': {
          nav: [{
            text: 'Home', link: '/'
          }, ...nav],
          sidebar: getSidebar(ctx.pages),
          smoothScroll: true
        }
      }
    },
    plugins: [
      ['@vuepress/back-to-top'],
      ['@vuepress/google-analytics', {
        ga: 'UA-152052026-1'
      }],
    ]
  }
}


function getSidebarChildren(dir) {
  return readdirSync(resolve(__dirname, '..' + dir))
    .filter(a => a.endsWith('.md'))
    .map(filename => dir + '/' + filename.slice(0, -3))
    .sort()
}

function getDirArticles(dir) {
  return readdirSync(resolve(__dirname, '..' + dir))
    .filter(a => a.endsWith('.md'))
    .map(filename => {
      return filename === 'README.md' ? '' : filename.slice(0, -3)
    })
    .sort()
}

function getSidebar(pages) {
  const sidebar = {}
  navMetadata.forEach(item => {
    if (item.sideDirList) {
      const s = item.sideDirList.map(side => {
        return {
          title: side.title,
          collapsable: true, // 可选的, 默认值是 true,
          sidebarDepth: 1,    // 可选的, 默认值是 1
          children: getSidebarChildren(side.dir)
        }
      })
      sidebar[item.link] = s
    } else {
      sidebar[item.link] = getDirArticles(item.link)
    }

  })
  return sidebar
}
