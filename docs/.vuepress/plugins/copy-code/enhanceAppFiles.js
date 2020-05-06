const copyTextStyle = {
  position: 'absolute',
  left: '10px',
  top: '0.5em',
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  zIndex: 99
}
export default ({ Vue }) => {
  Vue.mixin({
    methods: {
      handleCopy(text) {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')  // 添加只读属性
        textarea.style.position = 'absolute'   // 设置绝对定位
        textarea.style.left = '-99999px'       // 设置偏移, 为了不在可视范围内看到
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
          document.body.removeChild(textarea)
          alert('复制成功')
        } catch (e) {
          alert('该浏览器不支持复制功能, 请手动复制')
          document.body.removeChild(textarea)
        }
      },
      addCodeCopy(codes) {
        codes.forEach((codeDiv, index) => {
          const id = `code-${index}`
          if (!codeDiv.querySelector(`#${id}`)) {
            const codeSpan = document.createElement('div')
            codeSpan.innerText = codeSpan.textContent = 'copy'
            for (let key in copyTextStyle) {
              codeSpan.style[key] = copyTextStyle[key]
            }
            codeSpan.setAttribute('id', id)
            const contextCode = codeDiv.querySelector('code')
            codeSpan.addEventListener('click', this.handleCopy.bind(this, contextCode.textContent), false)
            codeDiv.appendChild(codeSpan)
          }
        })
      },
      getCodes() {
        return document.querySelectorAll('div[class*="language-"]')
      }
    },
    mounted() {
      const codes = this.getCodes()
      this.addCodeCopy(codes)
    }
  })
}
