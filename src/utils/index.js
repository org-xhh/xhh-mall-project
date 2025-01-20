import { padZero } from '@web-xhh/web-utils'

// 时间转换（倒计时）
export function transferTime(leftTime, isPadZero) {
  let day, hour, minute, second

  // 天
  day = parseInt(leftTime / 1000 / 60 / 60 / 24, 10)
  // 时
  hour = parseInt(leftTime / 1000 / 60 / 60 - 24 * day, 10)
  // 分
  minute = parseInt(leftTime / 1000 / 60 - 24 * 60 * day - 60 * hour, 10)
  // 秒
  second = parseInt(leftTime / 1000 - 24 * 60 * 60 * day - 60 * 60 * hour - 60 * minute, 10)

  if (isPadZero) {
    return {
      day: padZero(day),
      hour: padZero(hour),
      minute: padZero(minute),
      second: padZero(second)
    }
  } else {
    return {
      day,
      hour,
      minute,
      second
    }
  }
}

// 打印日志
export function consoleLog() {
  const handleConsoleLog = (title, content, color) => {
    console.log(
      `%c ${title} %c ${content} %c`,
      `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
      ''
    )
  }
  // 基础信息
  const info = (text, content) => {
    let title = !content ? 'info' : text
    content = !content ? text : content
    handleConsoleLog(title, content, '#1F1F1F')
  }
  // 警告
  const warn = (text, content) => {
    let title = !content ? 'warn' : text
    content = !content ? text : content
    handleConsoleLog(title, content, '#E86E30')
  }
  // 错误
  const error = (text, content) => {
    let title = !content ? 'error' : text
    content = !content ? text : content
    handleConsoleLog(title, content, '#DC362E')
  }
  return {
    info,
    warn,
    error
  }
}
