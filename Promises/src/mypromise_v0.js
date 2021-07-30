class MyPromise {
  constructor(fct) {
    this.state = "pending";
    this.result;
    this.nextPromise ;
    this.onFulfilled ;
    
    if (fct) {
      // invoke inner function and pass resolve() and reject() as arrow function to capture the this.
      fct(
        (r) => {
          this.resolve(r);
        },
        (e) => {
          this.reject(e);
        }
      );
    }
  }

  then(onFulfilled) {
    this.nextPromise = new MyPromise();
    this.onFulfilled = onFulfilled;

    // check if promise is already resolved
    if (this.state == "fulfilled") {
      this._doResolve(this.result);
    }

    // chain promises ...
    return this.nextPromise;
  }

  resolve(result) {
    this.result = result;
    this.state = "fulfilled";
    this._doResolve(result);
  }

  reject(error) {
    this.result = error;
    this.state = "rejected";
    // no implemented yet
  }

  _doResolve(result) {
    // check if end of promise chain or if .then not called yet
    if (this.nextPromise == null) return;

    if (this.onFulfilled) {
      // invoke callback
      var res = this.onFulfilled(result);
      // resolve next promise asynchronously
      setTimeout(() => this.nextPromise.resolve(res), 0);
    }
  }

  toString() {
    var s = `MyPromise {<${this.state}>`;
    return this.state == "pending" ? `${s}}` : `${s}: '${this.result}'}`;
  }
}


// global variables to track end of the last promise
var isLastPromiseFulfilled = false;
var isLastPromiseRejected = false;
var isLastPromisePending = true;

const p1 = new MyPromise((resolve, reject) => {
  //const p1 = new Promise((resolve, reject) => {
  console.log("Start Promise inner function, will resolve in 5s");
  setTimeout(() => {
    resolve("Resolved");
  }, 5 * 1000); // P1 -> delay resolve by 5 seconds
});

// build a promise chain, each call to .then() return a new Promise.
const p2 = p1.then((r) => (`P1:${r}`));   // Promise 2 -> will resolve with: P1:Resolve
const p3 = p2.then((r) => (`P2:${r}`));   // Promise 3 -> will resolve with: P2:P1:Resolve
const p4 = p3.then((r) => (`P3:${r}`));   // Promise 4 -> will resolve with: P3:P2:P1:Resolve

p4.then((r) => {
  // toggle global var to track end of last promise
  isLastPromiseFulfilled = true;
  isLastPromisePending = false;
  console.log(`-> P4:${r}`);   // P4 will display: -> P4:P3:P2:P1:Resolve 
});

//  Create an interval to display promise's status every second.
var logCount = 1;
console.log("Start logging");
var interval = setInterval(() => {
  console.log(`${logCount++} ---------------------------`);
  console.log(`P1:${p1}, P2:${p2}, P3:${p3}, P4:${p4}`);
  logCount++;
  // clear interval if the last promise has been fulfilled.
  if (!isLastPromisePending) {
    clearInterval(interval);
    console.log("End of logging");
  }
}, 1000);
