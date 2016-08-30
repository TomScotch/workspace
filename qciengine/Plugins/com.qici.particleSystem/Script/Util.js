/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 粒子系统工具库
 */
qc.ParticleSystem.Util = {
    /**
     * 从指定的最小最大值范围内取一个随机值
     */
    getRandom: function(data) {
        if (!Array.isArray(data) || data.length < 2) {
            return 0;
        }

        var min = data[0] || 0;
        var max = data[1] || 0;

        var t = Math.random();
        var rnd = min + t * (max - min);
        return rnd;
    },

    /**
     * 根据一个初始值和浮动范围生成一个随机值
     */
    getRandomByVariation: function(initial, variation) {
        initial = initial || 0;
        variation = variation || 0;

        return initial + variation * (1 - 2 * Math.random());
    }
};
