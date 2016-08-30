/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 记录声音时长
 */
COMMAND_D.registerCmd({
    name : 'RECORD_SOUND_DURATION',
    main : function(socket, cookie, args) {
        var sound = args.sound;
        var duration = args.duration;
        SOUND_DURATION_D.recordSoundDuration(sound, duration);
    }
});
