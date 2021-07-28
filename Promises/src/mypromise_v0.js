class MyPromise {
  constructor(fct) {
    this.state = "pending";
    this.result;
    this.nextPromise ;
    this.onFulfilled ;
    
    if (fct) {
      // invoke inner function 
      fct(
        (r) => {
          // pass arrow function to capture the: this
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

var isLastPromiseFulfilled = false;
var isLastPromiseRejected = false;
var isLastPromisePending = true;

const p1 = new MyPromise((resolve, reject) => {
  //const p1 = new Promise((resolve, reject) => {
  console.log("Start Promise inner function, will resolve in 5s");
  setTimeout(() => {
    resolve("Resolved");
  }, 5 * 1000); // delay resolve by 5 seconds
});

// build a promise chain
const p2 = p1.then((r) => {
  console.log(`P1 fulfilled:${r}`);
  return `P1:${r}`;
});
const p3 = p2.then((r) => {
  console.log(`P2 fulfilled:${r}`);
  return `P2:${r}`;
});
const p4 = p3.then((r) => {
  console.log(`P3 fulfilled:${r}`);
  return `P3:${r}`;
});
p4.then((r) => {
  console.log(`Last Promise fulfilled:${r}`);
  isLastPromiseFulfilled = true;
  isLastPromisePending = false;
  return `Last Promise:${r}`;
});

// logging loop
var logCount = 1;
console.log("Start logging");
var interval = setInterval(() => {
  console.log(`${logCount} ---------------------------`);
  console.log(`P1:${p1}, P2:${p2}, P3:${p3}`);
  console.log(`P4:${p4}`);
  // console.log(p1, p2, p3);
  // console.log(p4);
  logCount++;
  if (!isLastPromisePending) {
    clearInterval(interval);
    console.log("End of logging");
  }
}, 1000);
