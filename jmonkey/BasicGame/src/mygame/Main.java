package mygame;

import com.jme3.app.SimpleApplication;
import com.jme3.app.state.VideoRecorderAppState;
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;
import com.jme3.input.controls.Trigger;
import com.jme3.system.AppSettings;

public class Main extends SimpleApplication {

    private VideoRecorderAppState videoRecorderAppState;
    private Trigger pause_trigger = new KeyTrigger(KeyInput.KEY_BACK);
    private Trigger save_trigger = new KeyTrigger(KeyInput.KEY_RETURN);
    private Trigger record_trigger = new KeyTrigger(KeyInput.KEY_F6);
    private boolean isRunning = false;
    private GameRunningState gameRunningState;
    private StartScreenState startScreenState;
    private SettingsScreenState settingsScreenState;

    public static void main(String[] args) {
        Main app = new Main();
        AppSettings cfg = new AppSettings(true);
        //cfg.setFrameRate(60);
        cfg.setVSync(false);
        //cfg.setFrequency(60);
        cfg.setResolution(1360, 768);
        cfg.setFullscreen(false);
        cfg.setSamples(0);
        app.setPauseOnLostFocus(true);
        cfg.setRenderer(AppSettings.LWJGL_OPENGL2);
        cfg.setTitle("Serenity 1.0");
        app.setShowSettings(false);
        app.setSettings(cfg);
        app.start();
    }

    @Override
    public void simpleInitApp() {

        inputManager.setCursorVisible(false);

        videoRecorderAppState = new VideoRecorderAppState();

        setDisplayFps(true);
        setDisplayStatView(false);

        gameRunningState = new GameRunningState(this);
        startScreenState = new StartScreenState(this);
        settingsScreenState = new SettingsScreenState(this);

        stateManager.attach(startScreenState);

        inputManager.addMapping("Game Pause Unpause", pause_trigger);
        inputManager.addListener(actionListener, new String[]{"Game Pause Unpause"});
        inputManager.addMapping("Toggle Settings", save_trigger);
        inputManager.addListener(actionListener, new String[]{"Toggle Settings"});
        inputManager.addMapping("record", record_trigger);
        inputManager.addListener(actionListener, new String[]{"record"});
    }
    private ActionListener actionListener = new ActionListener() {
        @Override
        public void onAction(String name, boolean isPressed, float tpf) {

            isRunning = gameRunningState.getIsRunning();

            if (name.equals("Game Pause Unpause") && !isPressed) {

                if (isRunning) {
                    stateManager.detach(gameRunningState);
                    stateManager.attach(startScreenState);
                    System.out.println("switching to startscreen...");

                } else {
                    if (stateManager.hasState(startScreenState)) {
                        stateManager.detach(startScreenState);
                        stateManager.attach(gameRunningState);
                        System.out.println("switching to game...");
                    }
                }
            }

            if (name.equals("record") && !isPressed && !isRunning) {
                if (stateManager.hasState(videoRecorderAppState)) {
                    stateManager.detach(videoRecorderAppState);
                    System.out.println("finished recording");
                } else if (stateManager.hasState(videoRecorderAppState)) {
                    stateManager.attach(videoRecorderAppState);
                    System.out.println("start record");
                }
                stateManager.attach(videoRecorderAppState);
            }

            if (name.equals("Toggle Settings") && !isPressed && !isRunning) {
                if (stateManager.hasState(startScreenState)) {
                    stateManager.detach(startScreenState);
                    stateManager.attach(settingsScreenState);
                    System.out.println("switching to settings...");
                } else if (stateManager.hasState(settingsScreenState)) {
                    stateManager.detach(settingsScreenState);
                    stateManager.attach(startScreenState);
                    System.out.println("switching to startscreen...");
                }
            }
        }
    };

    @Override
    public void simpleUpdate(float tpf) {
    }
}
