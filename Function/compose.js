import * as _ from 'ramda';
// 使用 _.compose() 重写下面这个函数。提示：_.prop() 是 curry 函数
var isLastInStock = function(cars) {
  var last_car = _.last(cars);
  return _.prop('in_stock', last_car);
};

var isLastInStock = _.compose(_.prop('in_stock'), _.last);
var nameOffFirstCal = _.compose(_.prop('name'), _.head);

var _average = function(xs) {
  return reduce(add, 0, xs) / xs.length;
}; // <- 无须改动

var averageDollarValue = function(cars) {
  var dollar_values = map(function(c) {
    return c.dollar_value;
  }, cars);
  return _average(dollar_values);
};

averageDollarValue = _.compose(_average, _.map(_.prop('dollar_value')));

// 使用 compose 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串：例如：sanitizeNames(["Hello World"]) //=> ["hello_world"]。

var _underscore = replace(/\W+/g, '_'); //<-- 无须改动，并在 sanitizeNames 中使用它

var sanitizeNames = undefined;
sanitizeNames = _.compose(_underscore, _.toLower, _.prop('name'));

var availablePrices = function(cars) {
  var available_cars = _.filter(_.prop('in_stock'), cars);
  return available_cars
    .map(function(x) {
      return accounting.formatMoney(x.dollar_value);
    })
    .join(', ');
};
availablePrices = _.compose(_.join(', '),accounting.formatMoney,_.map(_.prop('dollar_value')),_.filter(_.prop('in_stock'))
