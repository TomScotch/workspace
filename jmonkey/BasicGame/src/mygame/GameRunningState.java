package mygame;

import com.jme3.app.Application;
import com.jme3.app.SimpleApplication;
import com.jme3.app.state.AbstractAppState;
import com.jme3.app.state.AppStateManager;
import com.jme3.asset.AssetManager;
import com.jme3.bullet.BulletAppState;
import com.jme3.bullet.PhysicsSpace;
import com.jme3.font.BitmapFont;
import com.jme3.font.BitmapText;
import com.jme3.input.InputManager;
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;
import com.jme3.light.DirectionalLight;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import com.jme3.renderer.ViewPort;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;

public class GameRunningState extends AbstractAppState {

    private ViewPort viewPort;
    private Node rootNode;
    private Node guiNode;
    private AssetManager assetManager;
    private Node localRootNode = new Node("Game Screen RootNode");
    private Node localGuiNode = new Node("Game Screen GuiNode");
    private ColorRGBA backgroundColor = ColorRGBA.Blue;
    private InputManager inputManager;
    private BulletAppState bulletAppState;
    private boolean isRunning = false;

    public GameRunningState(SimpleApplication app) {

        this.rootNode = app.getRootNode();
        this.viewPort = app.getViewPort();
        this.guiNode = app.getGuiNode();
        this.assetManager = app.getAssetManager();
        this.inputManager = app.getInputManager();

        //======================================================================

        Spatial terrain = assetManager.loadModel("Scenes/terrain.j3o");
        Material mat = new Material(assetManager, "Common/MatDefs/Misc/ShowNormals.j3md");
        terrain.setMaterial(mat);
        localRootNode.attachChild(terrain);
        //======================================================================

        DirectionalLight sun = new DirectionalLight();
        sun.setDirection((new Vector3f(-0.5f, -0.5f, -0.5f)).normalizeLocal());
        sun.setColor(ColorRGBA.White);
        localRootNode.addLight(sun);

        //======================================================================

        //======================================================================

        //======================================================================


        loadHintText("Game running");
        //setupKeys();
    }

    @Override
    public void initialize(AppStateManager stateManager, Application app) {
        super.initialize(stateManager, app);
        System.out.println("initialized Game");
        viewPort.setBackgroundColor(backgroundColor);

    }

    private PhysicsSpace getPhysicsSpace() {
        return bulletAppState.getPhysicsSpace();
    }

    private void loadHintText(String txt) {

        BitmapFont guiFont = assetManager.loadFont(
                "Interface/Fonts/Default.fnt");
        BitmapText displaytext = new BitmapText(guiFont);
        displaytext.setSize(guiFont.getCharSet().getRenderedSize());
        displaytext.move(10, displaytext.getLineHeight() + 20, 0);
        displaytext.setText(txt);
        localGuiNode.attachChild(displaytext);
    }

    private void setupKeys() {
        inputManager.addMapping("return",
                new KeyTrigger(KeyInput.KEY_RETURN));
        inputManager.addListener(actionListener, "return");
    }
    private ActionListener actionListener = new ActionListener() {
        @Override
        public void onAction(String name, boolean value, float tpf) {
            switch (name) {
                case "return":
                    if (value) {
                        System.out.println("return");
                    } else {
                    }
                    break;
            }
        }
    };

    @Override
    public void update(float tpf) {
        if (getIsRunning()) {
            super.update(tpf);
        }
    }

    @Override
    public void stateAttached(AppStateManager stateManager) {

        rootNode.attachChild(localRootNode);
        guiNode.attachChild(localGuiNode);
        setIsRunning(true);
    }

    @Override
    public void stateDetached(AppStateManager stateManager) {

        rootNode.detachChild(localRootNode);
        guiNode.detachChild(localGuiNode);
        setIsRunning(false);
    }

    /**
     * @return the stop
     */
    public boolean getIsRunning() {
        return isRunning;
    }

    /**
     * @param stop the stop to set
     */
    public void setIsRunning(boolean isRunning) {
        this.isRunning = isRunning;
    }
}