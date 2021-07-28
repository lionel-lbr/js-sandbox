class MyPromise {
  constructor(fct) {
    this.state = "pending";
    this.nextPromise = null;
    this.successCallback = null;
    this.errorCallback = null;
    this.value;
    this.resolveNextPromise = null ;
    this.rejectNextPromise = null ;

    if (fct) {
      try {
        fct(
          (r) => {
            // pass arrow function to capture the: this
            this.result = r;
            this.state = "resolved";
            this._doResolve(r);
          },
          (e) => {
            this.result = e;
            this.state = "rejected";
            this._doReject(e);
          }
        );
      } catch (e) {
        //reject the promise if the main promise function failed
        this.reject(e);
      }
    } 
  }

  then(successCallback, errorCallback) {
    this.nextPromise = new MyPromise((resolve, reject) => {
      console.log("NextPromise initialized");
      this.resolveNextPromise = resolve;
      this.rejectNextPromise = reject;
    });

    this.successCallback = successCallback;
    this.errorCallback = errorCallback;

    // check if promise is already fullfilled or rejected
    if (this.state == "resolved") {
      this._doResolve(this.value);
    } else if (this.state == "rejected") {
      this._doReject(this.value);
    }

    return this.nextPromise; // chain promises ...
  }

  catch(callback) {
    return this.then(null, callback);
  }

  // resolve(result) {
  //   this.result = result;
  //   this.state = "resolved";
  //   this._doResolve(result);
  // }

  // reject(error) {
  //   this.result = error;
  //   this.state = "rejected";
  //   this._doReject(error);
  // }

  _doResolve(result) {
    // check if end of promise chain or if .then not called yet
    if (this.nextPromise == null) return;

    // invoke callback
    if (this.successCallback) {
      try {
        var res = this.successCallback(result);
        // if callback return a promise, insert it in the chain
        // else resolve the next promise asynchronously
        if (res && res.then) {
          res.then(
            (r) => this.resolveNextPromise(r),
            (e) => this.rejectNextPromise(e)
          );
        } else {
          // setTimeout(() => this.nextPromise.resolve(res), 0);
          setTimeout(() => this.resolveNextPromise(res), 0);
        }
      } catch (e) {
        // if callback failed reject the next promissed
        // setTimeout(() => this.nextPromise.reject(e), 0);
        setTimeout(() => this.rejectNextPromise(e), 0);
      }
      return;
    }

    // if this step doesn't have a .then, pass result to the next promise.
    this.nextPromise.resolve(result);
  }

  _doReject(error) {
    // check if end of promise chain or if .then not called yet
    if (this.nextPromise == null) return;

    // invoke the callback
    if (this.errorCallback) {
      // if callback return a promise, insert it in the chain
      // else resolve the next promise asynchronously
      try {
        var res = this.errorCallback(error);
        if (res && res.then) {
          res.then(
            (r) => this.resolveNextPromise(r),
            (e) => this.rejectNextPromise(e)
          );
        } else {
          setTimeout(() => this.resolveNextPromise(res), 0);
        }
      } catch (e) {
        // if callback failed reject the next promissed
        setTimeout(() => this.rejectNextPromise(e), 0);
        return;
      }
      return;
    }

    // if this step doesn't have a .catch, pass error to the next promise.
    this.nextPromise.reject(error);
  }

  toString() {
    var s = `MyPromise {<${this.state}>`;
    s = this.result ? `${s}: '${this.result}'}` : `${s}}`;
    return s;
  }
}

function promiseSuccess(t, v) {
  var p = new MyPromise((resolve, reject) => {
    //var p = new Promise((resolve, reject) => {
    console.log("promise Sucess started");
    setTimeout(() => {
      console.log(`${v}:Sucess`);
      resolve(`${v}:Sucess`);
    }, t * 1000);
  });

  return p;
}

function promiseError(t, v) {
  var p = new MyPromise((resolve, reject) => {
    //  var p = new Promise((resolve, reject) => {
    console.log("promise Error started");
    setTimeout(() => {
      console.log(`${v}:Error`);
      reject(`${v}:Error`);
    }, t * 1000);
  });

  return p;
}

const p1 = new MyPromise((resolve, reject) => {
  //const p1 = new Promise((resolve, reject) => {
  console.log("Start Promise");
  setTimeout(() => {
    console.log("Start");
    resolve("Start");
  }, 10 * 1000);
});

const p2 = p1.then((r) => {
  console.log(r + 1);
  return r + 1;
});
const p3 = p2.then((r) => promiseSuccess(3, r));
const p4 = p3.then((r) => promiseError(3, r));
const p5 = p4.then((r) => promiseSuccess(3, `${r}:Should be ignored`)); // should be ignored
const p6 = p5.catch((e) => console.log(`${e}:End`));

console.log("End");
var interval = setInterval(() => {
  console.log(`p1:${p1}, p2:${p2}, p3:${p3}`);
  console.log(`p4:${p4}, p5:${p5}, p6:${p6}`);
  // console.log(p1, p2, p3);
  // console.log(p4, p5, p6);
  console.log("----------------------------------------------");
}, 1000);
