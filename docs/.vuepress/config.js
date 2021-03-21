const { readdirSync } = require("fs");
const { resolve } = require("path");
const { nav, navMetadata } = require("./utils/nav");
const copyCodePlugin = require("./plugins/copy-code/index");
const pageTagsPlugin = require("./plugins/page-tags/index");
module.exports = (ctx) => {
  return {
    base: "/",
    dest: "dist",
    title: "LiYajie",
    lang: "zh-CN",
    description: "LiYajie技术小栈",
    head: [
      [
        "script",
        {},
        `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?58532f8aaba138eae7c4d174e4c89665";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
      ],
      [
        "meta",
        {
          "http-equiv": "Content-Security-Policy",
          content: "upgrade-insecure-requests",
        },
      ],
    ],
    themeConfig: {
      logo: "/images/logo.jpg",
      useUpyun: true,
      locales: {
        "/": {
          lang: "zh-CN",
          nav: [
            {
              text: "Home",
              link: "/",
            },
            {
              text: "Tags",
              link: "/tags/",
            },
            ...nav,
          ],
          sidebar: getSidebar(ctx.pages),
          smoothScroll: true,
        },
      },
    },
    plugins: [
      [copyCodePlugin],
      [pageTagsPlugin],
      ["@vuepress/back-to-top"],
      [
        "@vuepress/google-analytics",
        {
          ga: "UA-152052026-1",
        },
      ],
      [
        "@vssue/vuepress-plugin-vssue",
        {
          locale: "zh",
          // 设置 `platform` 而不是 `api`
          platform: "github",

          // 其他的 Vssue 配置
          owner: "liyajie920112",
          repo: "blog2",
          clientId: "fadb7a4cb5f3e3672f13",
          clientSecret: process.env.clientSecret,
        },
      ],
    ],
  };
};

function getSidebarChildren(dir) {
  return readdirSync(resolve(__dirname, ".." + dir))
    .filter((a) => a.endsWith(".md"))
    .map((filename) => dir + "/" + filename.slice(0, -3))
    .sort();
}

function getDirArticles(dir) {
  return readdirSync(resolve(__dirname, ".." + dir))
    .filter((a) => a.endsWith(".md"))
    .map((filename) => {
      return filename === "README.md" ? "" : filename.slice(0, -3);
    })
    .sort();
}

function getSidebar(pages) {
  const sidebar = {};
  navMetadata.forEach((item) => {
    if (item.sideDirList) {
      const s = item.sideDirList.map((side) => {
        return {
          title: side.title,
          collapsable: true, // 可选的, 默认值是 true,
          sidebarDepth: 1, // 可选的, 默认值是 1
          children: getSidebarChildren(side.dir),
        };
      });
      sidebar[item.link] = s;
    } else {
      sidebar[item.link] = getDirArticles(item.link);
    }
  });
  return sidebar;
}
