package mygame;

import com.jme3.animation.AnimChannel;
import com.jme3.animation.AnimControl;
import com.jme3.animation.AnimEventListener;
import com.jme3.animation.LoopMode;
import com.jme3.app.Application;
import com.jme3.app.SimpleApplication;
import com.jme3.app.state.AbstractAppState;
import com.jme3.app.state.AppStateManager;
import com.jme3.asset.AssetEventListener;
import com.jme3.asset.AssetKey;
import com.jme3.asset.AssetManager;
import com.jme3.asset.TextureKey;
import com.jme3.bullet.BulletAppState;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.font.BitmapFont;
import com.jme3.font.BitmapText;
import com.jme3.input.InputManager;
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;
import com.jme3.light.DirectionalLight;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Vector3f;
import com.jme3.post.FilterPostProcessor;
import com.jme3.renderer.ViewPort;
import com.jme3.renderer.queue.RenderQueue;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.shadow.DirectionalLightShadowFilter;
import com.jme3.shadow.DirectionalLightShadowRenderer;
import com.jme3.texture.Texture;
import com.jme3.util.SkyFactory;

public class GameRunningState extends AbstractAppState implements AnimEventListener {

    private ViewPort viewPort;
    private Node rootNode;
    private Node guiNode;
    private AssetManager assetManager;
    private Node localRootNode = new Node("Game Screen RootNode");
    private Node localGuiNode = new Node("Game Screen GuiNode");
    private ColorRGBA backgroundColor = ColorRGBA.BlackNoAlpha;
    private InputManager inputManager;
    private BulletAppState bulletAppState;
    private boolean isRunning = false;
    private Spatial model;
    private FilterPostProcessor processor;
    private DirectionalLight sun;
    private Spatial terrain;
    private AnimChannel channel;
    private AnimControl control;

    public GameRunningState(SimpleApplication app) {

//==============================================================================
//      CONSTRUKTOR
        this.rootNode = app.getRootNode();
        this.viewPort = app.getViewPort();
        this.guiNode = app.getGuiNode();
        this.assetManager = app.getAssetManager();
        this.inputManager = app.getInputManager();
	this.app.setTimer(new IsoTimer(60));
//==============================================================================
//      PHYSICS STATE
        bulletAppState = new BulletAppState();
        app.getStateManager().attach(bulletAppState);
//==============================================================================
//      TEST SKY
        Texture west = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_west.jpg");
        Texture east = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_east.jpg");
        Texture north = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_north.jpg");
        Texture south = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_south.jpg");
        Texture up = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_up.jpg");
        Texture down = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_down.jpg");

        Spatial sky = SkyFactory.createSky(assetManager, west, east, north, south, up, down);
        sky.setLocalTranslation(0, -1000, 0);
        localRootNode.attachChild(sky);
//==============================================================================
//      TEST MODEL
        model = assetManager.loadModel("Models/simple_girl26/simple_girl2.6.j3o");
        model.setShadowMode(RenderQueue.ShadowMode.Cast);
        model.setLocalTranslation(0, 10, 0);
        model.addControl(new RigidBodyControl(700));
        bulletAppState.getPhysicsSpace().addAll(model);
        localRootNode.attachChild(model);
//==============================================================================
//      TEST SUN
        sun = new DirectionalLight();
        sun.setDirection(model.getWorldTranslation());
        localRootNode.addLight(sun);
//==============================================================================        
//      TEST TERRAIN
        terrain = assetManager.loadModel("Scenes/terrain.j3o");
        terrain.setLocalTranslation(0, 3, 0);
        terrain.addControl(new RigidBodyControl(0));
        terrain.setShadowMode(RenderQueue.ShadowMode.Receive);
        bulletAppState.getPhysicsSpace().addAll(terrain);
        localRootNode.attachChild(terrain);
//==============================================================================
//      TEST CAMERA
        viewPort.getCamera().setLocation(new Vector3f(0, 6f, 7.0f));
        app.getFlyByCamera().setMoveSpeed(20);
        app.getFlyByCamera().setRotationSpeed(0.75f);
        app.getFlyByCamera().setDragToRotate(false);
//==============================================================================
//      TEST GUI TEXT
        loadHintText("Game running");
//==============================================================================        
//      LIGHT AND SHADOWS
        DirectionalLightShadowRenderer dlsr = new DirectionalLightShadowRenderer(assetManager, 1024, 2);
        dlsr.setLight(sun);
        viewPort.addProcessor(dlsr);

        FilterPostProcessor fpp = new FilterPostProcessor(assetManager);
        DirectionalLightShadowFilter dlsf = new DirectionalLightShadowFilter(assetManager, 1024, 4);
        dlsf.setLight(sun);
        fpp.addFilter(dlsf);
        viewPort.addProcessor(fpp);

//==============================================================================
//      ANISOTROPY        
        AssetEventListener asl = new AssetEventListener() {
            @Override
            public void assetRequested(AssetKey key) {
                if (key.getExtension().equals("png") || key.getExtension().equals("jpg") || key.getExtension().equals("dds")) {
                    TextureKey tkey = (TextureKey) key;
                    tkey.setAnisotropy(8);
                }
            }

            @Override
            public void assetLoaded(AssetKey key) {
                //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
            }

            @Override
            public void assetDependencyNotFound(AssetKey parentKey, AssetKey dependentAssetKey) {
                //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
            }
        };
        assetManager.addAssetEventListener(asl);
//==============================================================================
//        ANIMATION CHANNEL AND CONTROL
        Node n = (Node) model;
        Node n1 = (Node) n.getChild("player");

        control = n1.getControl(AnimControl.class);
        control.addListener(this);
        channel = control.createChannel();
        System.out.println(channel.getAnimationName());
    }

    @Override
    public void initialize(AppStateManager stateManager, Application app) {
        super.initialize(stateManager, app);
        System.out.println("initialized Game");
        viewPort.setBackgroundColor(backgroundColor);
        processor = (FilterPostProcessor) assetManager.loadAsset("Filters/myFilter.j3f");
        viewPort.addProcessor(processor);
        inputManager.setCursorVisible(false);

    }

    private void loadHintText(String txt) {

        BitmapFont guiFont = assetManager.loadFont(
                "Interface/Fonts/Default.fnt");
        BitmapText displaytext = new BitmapText(guiFont);
        displaytext.setName("gametext");
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
                        channel.setAnim("cammina", 0.50f);
                        channel.setLoopMode(LoopMode.DontLoop);
			Capture.captureVideo(app, File.createTempFile("GlobalLightingTest",".avi"));
                    } else {
                    }
                    break;
            }
        }
    };
    Node pivot = new Node();
    int c = 0;

    @Override
    public void update(float tpf) {

        if (getIsRunning()) {

            super.update(tpf);

            if (c++ >= 300) {
                c = 0;
                localGuiNode.detachChildNamed("gametext");
            }

            pivot.rotate((FastMath.QUARTER_PI * tpf) / 15, 0, 0);
            sun.setDirection(pivot.getLocalRotation().getRotationColumn(2));
        }
    }

    @Override
    public void stateAttached(AppStateManager stateManager) {
        setupKeys();
        bulletAppState.startPhysics();
        rootNode.attachChild(localRootNode);
        guiNode.attachChild(localGuiNode);
        setIsRunning(true);
    }

    @Override
    public void stateDetached(AppStateManager stateManager) {
        viewPort.removeProcessor(processor);
        bulletAppState.stopPhysics();
        inputManager.deleteMapping("return");
        inputManager.removeListener(actionListener);
        rootNode.detachChild(localRootNode);
        guiNode.detachChild(localGuiNode);
        setIsRunning(false);
    }

    public boolean getIsRunning() {
        return isRunning;
    }

    public void setIsRunning(boolean isRunning) {
        this.isRunning = isRunning;
    }

    @Override
    public void onAnimCycleDone(AnimControl control, AnimChannel channel, String animName) {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void onAnimChange(AnimControl control, AnimChannel channel, String animName) {
        // throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
