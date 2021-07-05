const divideBy100 = num => num / 100;

const roundTo2dp = num => num.toFixed(2);


const addDollarSign = string => `$${String(string)}`;

const compose = (...fns) => x => fns.reduceRight(
  (response, fn)  => fn(response), x
);

const tap = fn => x =>{
 fn(x);
 return x;
}

const trace = label => tap(console.log.bind(console, label +':'));

const centsToDollars = compose(
  addDollarSign,
  roundTo2dp,
  divideBy100,
);

const isFunction = fn => fn 
  && Object.prototype.toString.call(fn) === '[object Function]';

const isAsync = fn => fn && Object.prototype.toString.call(fn) === '[object AsyncFunction]';

const isPromise = p => p && Object.prototype.toString.call(p) === '[object Promise]';



class Container {
  constructor(fn) {
    this.value = fn;
    if (!isFunction(fn) && !isAsync(fn)) {
      throw new TypeError(`Container expects a function, not a ${typeof fn}.`);
    };
  }

  map(fn) {
    if (!isFunction(fn) && !isAsync(fn)) {
      throw new TypeError(`The map method expects a function, not a ${typeof fn}.`);
    };

    return new Container(
      () => isPromise(this.value()) ?
        this.value().then(fn) : fn(this.value())
    )
  }

  run() {
    return this.value();
  }
};
const sayHello = () => 'Hello';
const addName = (name, str) => `${str} ${name}`
const container = new Container(sayHello);

const greet = container
  .map(addName.bind(this, 'Joe Bloggs'))
  .map(tap(console.log));

greet.run();