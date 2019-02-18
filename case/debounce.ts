// 实现一个防抖函数（参考lodash实现方式）
// func 目标函数
// wait 延迟的毫秒数，默认为0。
// options 配置项，默认 {}
// options.leading  第一次触发函数立即执行，默认为false
// options.maxWait 等待函数触发的最大时长
// options.tralling 最后一次触发函数立即执行，默认为 true
// root  为lodash的internel.root.js 输出顶部文件

// 适用范围举例
// 1. 点击事件 2. dom重绘
function debounce(func, wait, options) {
    let lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime
  
    let lastInvokeTime = 0
    let leading = false
    let maxing = false
    let trailing = true
  
    // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
    const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function')

    // 参数检查并赋值
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function')
    }
    wait = +wait || 0
    if (isObject(options)) {
      leading = !!options.leading
      maxing = 'maxWait' in options
      maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait  // 如果maxWait存在，则maxWait等于 maxWait 和 wait 中的最大值。
      trailing = 'trailing' in options ? !!options.trailing : trailing
    }
    
    // 执行函数
    function invokeFunc(time) {
      const args = lastArgs
      const thisArg = lastThis
  
      lastArgs = lastThis = undefined
      lastInvokeTime = time
      result = func.apply(thisArg, args)
      return result
    }
  
    function startTimer(pendingFunc, wait) {
      if (useRAF) {
        root.cancelAnimationFrame(timerId);
        return root.requestAnimationFrame(pendingFunc)
      }
      return setTimeout(pendingFunc, wait)
    }
  
    function cancelTimer(id) {
      if (useRAF) {
        return root.cancelAnimationFrame(id)
      }
      clearTimeout(id)
    }
  
    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time
      // Start the timer for the trailing edge.
      timerId = startTimer(timerExpired, wait)
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result
    }
  
    function remainingWait(time) {
      const timeSinceLastCall = time - lastCallTime
      const timeSinceLastInvoke = time - lastInvokeTime
      const timeWaiting = wait - timeSinceLastCall
  
      return maxing
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting
    }
  
    function shouldInvoke(time) {
      const timeSinceLastCall = time - lastCallTime
      const timeSinceLastInvoke = time - lastInvokeTime
  
      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
        (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
    }
  
    function timerExpired() {
      const time = Date.now()
      if (shouldInvoke(time)) {
        return trailingEdge(time)
      }
      // Restart the timer.
      timerId = startTimer(timerExpired, remainingWait(time))
    }
  
    function trailingEdge(time) {
      timerId = undefined
  
      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time)
      }
      lastArgs = lastThis = undefined
      return result
    }
  
    function cancel() {
      if (timerId !== undefined) {
        cancelTimer(timerId)
      }
      lastInvokeTime = 0
      lastArgs = lastCallTime = lastThis = timerId = undefined
    }
  
    function flush() {
      return timerId === undefined ? result : trailingEdge(Date.now())
    }
  
    function pending() {
      return timerId !== undefined
    }
  
    function debounced(...args) {
      const time = Date.now()
      const isInvoking = shouldInvoke(time)
  
      lastArgs = args
      lastThis = this
      lastCallTime = time
  
      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime)
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          timerId = startTimer(timerExpired, wait)
          return invokeFunc(lastCallTime)
        }
      }
      if (timerId === undefined) {
        timerId = startTimer(timerExpired, wait)
      }
      return result
    }
    debounced.cancel = cancel
    debounced.flush = flush
    debounced.pending = pending
    return debounced
  }
  
  export default debounce