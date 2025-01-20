export function resize() {
  let rootDom = document.documentElement
  let docWidth = rootDom.clientWidth
  let limitPageWidth = 1330

  if (docWidth < limitPageWidth && !rootDom.classList.contains('html-mini')) {
    rootDom.classList.remove('html-wide')
    rootDom.classList.add('html-mini')
  }
  if (docWidth >= limitPageWidth && !rootDom.classList.contains('html-wide')) {
    rootDom.classList.remove('html-mini')
    rootDom.classList.add('html-wide')
  }

  return {
    docWidth,
    limitPageWidth
  }
}
