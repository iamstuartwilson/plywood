/**
 * Simple Node based logger
 *
 * @param  object a.options
 *
 * @return object
 */
var plywood = function(settings) {
    // Api
    var a = {};

    // Standard logging methods and appropriate colors
    var standardMethods = {
        log: 'white',
        error: 'red',
        info: 'green'
    };

    // Interval id
    var interval;

    // Counts active loops
    var loopCount = 0;

    // Adds a colored prefix
    function prefix(val, pre) {
        var color = a.options.prefixColor;

        if (typeof pre === 'undefined') {
            pre = a.options.prefix;
        }

        if (typeof pre === 'string'  && pre !== '') {
            if (a.colors[color]) {
                return a.colors[color](pre + ' ') + val;
            }

            return pre + ' ' + val;
        }

        return val;
    }

    // Adds a prefix to the first first element in an array
    function prefixArray(args, pre) {
        args[0] = prefix(args[0], pre);

        return args;
    }

    // Log with a color, prefix, and optional new line
    function log(color, prefix, inline) {
        return function() {
            var args = objectToArray(arguments);

            args = prefixArray(args, prefix);

            var output = args.join(' ');

            if (color && a.colors[color]) {
                output = a.colors[color](output);
            }

            if (loopCount > 0 && ! inline) {
                a.logger.write('\n');
                stopLoop();
            }

            a.logger.write(output);

            if (! inline) {
                a.logger.write('\n');
            }

            return output;
        }
    }

    function inline(val, prefix) {
        return log(false, prefix, true).apply(this, [val]);
    }

    function block(arr) {
        for (var i = 0; i < arr.length; i ++) {
            var line = arr[i];

            if (typeof line === 'string') {
                line = [line];
            }

            log(false, false).apply(this, line);
        }
    }

    // End the output, stop interval and apply callback
    function end(cb) {
        inline('\n', false);
        stopLoop();

        if (typeof cb === 'function') {
            cb();
        }
    }

    // Loop over an array of values n times
    function loop(vals, options) {
        options = setOptions(options, {
            repeat: 0,
            interval: 1000,
            prefix: true
        });

        var i = 0;
        var clear = parseInt(options.repeat) > 0;
        var firstVal = vals[i];

        loopCount ++;

        if (loopCount > 1) {
            inline('\r', false);
            stopLoop();
        }

        if (options.replace) {
            resetLine();
        } else if (options.prefix) {
            firstVal = prefix(firstVal, options.prefix);
        }

        inline(firstVal);

        if (vals.length > 1) {
            i ++;
        }

        interval = setInterval(function() {
            if (options.replace) {
                resetLine();
            }

            if (options.replace) {
                inline(vals[i]);
            } else {
                inline(vals[i], false);
            }
            i ++;

            if (i === vals.length) {
                if (clear && options.repeat < 2) {
                    end(options.end);
                }

                i = 0;
                options.repeat --;
            }
        }, options.interval);
    }

    // Stop the interval
    function stopLoop() {
        loopCount --;
        clearInterval(interval);
    }

    function resetLine() {
        if (a.logger.cursorTo && a.logger.clearLine) {
            a.logger.cursorTo(0);
            a.logger.clearLine();
        }
    }

    // Convert an object to an array
    function objectToArray(obj) {
        var arr = [];

        for (var p in obj) {
            arr.push(obj[p]);
        }

        return arr;
    }

    // Set an option
    function setOption(option, value) {
        if (option && typeof value !== 'undefined') {
            return a.options[option] = value;
        }

        return false;
    }

    function setOptions(options, defaults) {
        options = options || {};
        defaults = defaults || {};

        for (var prop in defaults) {
            if (typeof options[prop] === 'undefined') {
                options[prop] = defaults[prop];
            }
        }

        return options;
    }

    // Construct option
    function init() {
        // Constructor option fallback
        a.options = setOptions(settings, {
            prefix: '[' + require('./package').name + ']',
            prefixColor: 'cyan'
        });

        // Basic object properties
        a.colors = require('chalk');
        a.logger = process.stdout;

        // Setup standard methods with colors
        for (var p in standardMethods) {
            a[p] = log(standardMethods[p]);
        }

        // Extended methods
        a.inline = inline;
        a.end = end;
        a.loop = loop;
        a.set = setOption;
        a.block = block;

        return a;
    }

    // Return logger
    return init();

}

module.exports = plywood;
