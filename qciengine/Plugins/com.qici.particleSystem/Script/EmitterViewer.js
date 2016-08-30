/**
 * @author lijh
 * copyright 2015 Qcplay All Rights Reserved.
 */

/**
 * 粒子信息查看器
 * @class qc.EmitterViewer
 */
var EmitterViewer = qc.defineBehaviour('qc.EmitterViewer', qc.Behaviour, function() {
        var self = this;

        self.now = self.game.time.now;
        self.runInEditor = true;
        self.debugOn = true;

        // 多久统计1次，单位为秒
        self.duration = 1;
    },
    {
        debugOn: qc.Serializer.BOOLEAN,
        particleSystem: qc.Serializer.NODE
    }
);

// 菜单上的显示
EmitterViewer.__menu = 'Debug/EmitterViewer';

Object.defineProperties(EmitterViewer.prototype, {
    /**
     * @property {boolean} debugOn - 调试开关是否开启
     */
    debugOn: {
        get: function()  { return this._debugOn; },
        set: function(v) { this._debugOn = v;    }
    },

    /**
     * @property {qc.Node} particleSystem - 关联的粒子系统节点
     */
    particleSystem: {
        get: function()  { return this._particleSystem; },
        set: function(v) { this._particleSystem = v;    }
    }
});

EmitterViewer.prototype.postUpdate = function() {
    if (!this.particleSystem)
        return;

    if (!this.debugOn)
        return;

    var now = this.game.time.now;
    if (now - this.now >= this.duration * 1000) {
        var emitter = this.particleSystem.emitter;
        if (emitter === null)
            return;

        var text = qc.Util.formatString('\n\n({0})\nAlive:{1}\nDead:{2}\nTotal:{3}',
            this.particleSystem.name,
            emitter.list.length,
            emitter.pool.length,
            emitter.list.length + emitter.pool.length);

        if (this.gameObject instanceof qc.UIText)
            this.gameObject.text = text;
        else if (this.gameObject instanceof qc.Dom) {
            text = text.replace(/\n/g, '<br/>');
            this.gameObject.innerHTML = text;
        }
    }
};

