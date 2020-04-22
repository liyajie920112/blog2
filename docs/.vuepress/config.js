module.exports = {
  title: 'LiYajie',
  description: 'LiYajie技术小栈',
  themeConfig: {
    sidebar: 'auto',
    nav: [{
      text: 'Home', link: '/'
    }, {
      text: 'Blog', link: '/blog/'
    }],
    sidebar: [{
      title: '面试',
      // path: '/blog/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
      collapsable: true, // 可选的, 默认值是 true,
      sidebarDepth: 1,    // 可选的, 默认值是 1
      children: [
        '/blog/interview/'
      ]
    }],
    smoothScroll: true
  }
}
