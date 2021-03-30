class Promise {
  constructor(executor) {
    this.state = 'pending';
    this.reason = undefined;
    this.value = undefined;
    this.successArray = [];
    this.failArray = [];
    let resolve = (value) => {
      this.state = 'fulfilled';
      this.value = value;
      this.successArray.forEach((fn = fn(value)));
    };
    let reject = (reason) => {
      this.state = 'rejected';
      this.reason = reason;
      this.failArray.forEach((fn) => fn(reason));
    };
    // 立即执行executor
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err;
          }; // 失败时，如果不throw err ,会跑到下一个then中
    const promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.state === 'pending') {
        this.successArray.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.failArray.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }
    // 防止重复调用
    let called = false;
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        // A+规定，声明then = x的then方法
        let then = x.then;
        // 判断then 是不是函数
        if (typeof then === 'function') {
          // 这里确定x仍是一个Promise，那么就继续resolvePromise
          then.call(
            this,
            (y) => {
              // 成功和失败只能调用一个
              if (called) return;
              called = true;
              // resolve的结果依旧是promise 那就继续解析
              resolvePromise(promise2, y, resolve, reject);
            },
            (err) => {
              if (called) return;
              called = true;
              reject(err); // 失败了就失败了
            }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        // 也属于失败
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      // x是基本值
      resolve(x);
    }
  }

  resolve(value) {
    return new Promise((resolve) => resolve(value));
  }

  reject(value) {
    return new Promise((resolve, reject) => reject(value));
  }

  race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises.then(resolve, reject);
      }
    });
  }

  all(promises) {
    let array = [];

    return new Promise((resolve, reject) => {
      let pindex = 0;
      function processData(index, data) {
        array[index] = data;
        pindex++;
        if (pindex == promises.length) {
          resolve(arr);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        promises.then((value) => {
          processData(i, value);
        }, reject);
      }
    });
  }
}
