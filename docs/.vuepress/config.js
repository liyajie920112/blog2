const { readdirSync } = require('fs')
const { resolve } = require('path')
const { nav, navMetadata } = require('./utils/nav')
const copyCodePlugin = require('./plugins/copy-code/index')
module.exports = ctx => {
  return {
    base: '/',
    dest: 'dist',
    title: 'LiYajie',
    description: 'LiYajie技术小栈',
    head: [[
      'script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?58532f8aaba138eae7c4d174e4c89665";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    ]],
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
      [copyCodePlugin],
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
