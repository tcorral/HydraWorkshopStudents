Hydra.setTestFramework(jstestdriver);
Function.prototype.getBody = function () {
    // Get content between first { and last }
    var m = this.toString().match(/\{([\s\S]*)\}/m)[1];
    // Strip comments
    return m.replace(/^\s*\/\/.*$/mg, '');
};