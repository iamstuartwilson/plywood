var plywood = require('../')({
    prefix: '[test]'
});

// Mocking console
var mockLogger = {
    stream: [],
    write: function(val) {
        this.stream.push(val);

        return this.stream.slice(-1);
    }
}

plywood.logger = mockLogger;
plywood.colors = {};

// Run tests
describe('Testing plywood', function() {

    // Test logging with constructed prefix
    it('should return a prefixed message', function() {
        expect(plywood.log('foo', 'bar')).toBe('[test] foo bar');
        expect(plywood.error('foo', 'bar')).toBe('[test] foo bar');
        expect(plywood.info('foo', 'bar')).toBe('[test] foo bar');
    });

    // Test logging with new prefix
    it('should return a new prefixed message', function() {
        plywood.set('prefix', '[newTest]')
        expect(plywood.log('foo', 'bar')).toBe('[newTest] foo bar');
        expect(plywood.error('foo', 'bar')).toBe('[newTest] foo bar');
        expect(plywood.info('foo', 'bar')).toBe('[newTest] foo bar');
    });

    // Test inline method
    it('should return a single line', function() {
        expect(plywood.inline('foo', false)).toBe('foo');
        expect(plywood.inline('bar', false)).toBe('bar');
    });

});
