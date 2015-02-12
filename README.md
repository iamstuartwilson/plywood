plywood
===========
A pliable logging utility for Node JS with colours, loops, blocks and more...

![intro](http://i.imgur.com/oCmOOOo.gif)

Installation
====

```
npm install plywood
```

Usage
====

```javascript
var plywood = require('plwood');
var p = plywood({
    prefix: '[plywood]'
});

p.log('Wood you like a cup of tea?');
// Outputs:
// [plywood] Wood you like a cup of tea?

p.set('prefix', '[hardboard]');

p.log('Yes Please!');
// Outputs:
// [hardboard] Yes Please!
```

API
====

## Standard logging utils

### p.log(vals)
```javascript
p.log('add', 'any', 'arguments', 'you', 'like');
// Outputs a line in white
```

### p.info(vals)
```javascript
p.info('Nice');
// Outputs a line in green
```

### p.error(vals)
```javascript
p.error('Crikey');
// Outputs a line in red
```

## Extended logging utils

### p.inline(val, [prefix])
This will output a line on the current line and add an optional prefix

```javascript
p.inline('single output');
// Outputs a line on the current line
```
### p.loop(vals, [opts])
This method will loop over an array ov values with additional settings

Examples: 

**Simple**

Loop over an array continually
```javascript
p.loop(['a', 'b', 'c']);
// Outputs:
// [plywood] a b c a b c a b c...
```

**Once**

Loop over the array once
```javascript
p.loop(['a', 'b', 'c'], {
    repeat: 1
});
// Outputs:
// [plywood] a b c
```

**Replace**

Replace the last output line with the next item in the array
```javascript
p.loop(['a', 'b', 'c'], {
    replace: true
});
```
