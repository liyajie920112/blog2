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
    text: 'TypeScript',
    link: '/typescript/',
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
