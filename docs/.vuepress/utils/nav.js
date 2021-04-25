const navMetadata = [
  {
    text: 'Article',
    link: '/blog/',
    sideDirList: [
      {
        title: '目录',
        dir: '/blog/article',
      },
    ],
  },
  {
    text: 'WeChat',
    link: '/wechat/',
    sideDirList: [
      {
        title: 'webpack',
        dir: '/wechat/webpack'
      },
      {
        title: 'css',
        dir: '/wechat/css'
      }
    ]
  },
  {
    text: 'Vue',
    link: '/vue/',
  },
]

const nav = navMetadata.map((a) => ({
  text: a.text,
  link: a.link,
}))

module.exports = {
  nav,
  navMetadata,
}
