/**
 * @author weism
 * @copyright 2015 Qcplay All Rights Reserved.
 *
 * 本地化支持
 */

var values = require('./Language');
var language = 'en';
module.exports = {
    _: function(en) {
        if (!values[en] || !values[en][language])
            return en;
        return values[en][language];
    },

    setLanguage: function(l) {
        language = l;
    }
};

// 使用的语言
G._ = module.exports._;
G.setLanguage = module.exports.setLanguage;
