package mygame;

import com.jme3.app.Application;
import com.jme3.app.SimpleApplication;
import com.jme3.app.state.AbstractAppState;
import com.jme3.app.state.AppStateManager;
import com.jme3.asset.AssetManager;
import com.jme3.bullet.BulletAppState;
import com.jme3.bullet.PhysicsSpace;
import com.jme3.bullet.control.BetterCharacterControl;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.font.BitmapFont;
import com.jme3.font.BitmapText;
import com.jme3.input.FlyByCamera;
import com.jme3.input.InputManager;
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;
import com.jme3.light.SpotLight;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.math.Vector2f;
import com.jme3.math.Vector3f;
import com.jme3.post.FilterPostProcessor;
import com.jme3.post.filters.LightScatteringFilter;
import com.jme3.renderer.ViewPort;
import com.jme3.renderer.queue.RenderQueue.ShadowMode;
import com.jme3.scene.CameraNode;
import com.jme3.scene.Geometry;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.scene.control.CameraControl;
import com.jme3.scene.shape.Box;
import com.jme3.shadow.EdgeFilteringMode;
import com.jme3.shadow.SpotLightShadowRenderer;
import com.jme3.texture.Texture;
import com.jme3.texture.Texture.WrapMode;
import com.jme3.util.SkyFactory;
import com.jme3.util.TangentBinormalGenerator;
import com.jme3.water.WaterFilter;

public class GameRunningState extends AbstractAppState {

    private ViewPort viewPort;
    private Node rootNode;
    private Node guiNode;
    private AssetManager assetManager;
    private Node localRootNode = new Node("Game Screen RootNode");
    private Node localGuiNode = new Node("Game Screen GuiNode");
    private final ColorRGBA backgroundColor = ColorRGBA.Blue;
    boolean wireframe = false;
    boolean triPlanar = false;
    boolean wardiso = false;
    boolean minnaert = false;
    protected BitmapText hintText;
    private InputManager inputManager;
    private BulletAppState bulletAppState;
    private BetterCharacterControl physicsCharacter;
    private Node characterNode;
    private CameraNode camNode;
    boolean rotate = false;
    private Vector3f walkDirection = new Vector3f(0, 0, 0);
    private Vector3f viewDirection = new Vector3f(0, 0, 1);
    boolean leftStrafe = false, rightStrafe = false, forward = false, backward = false,
            leftRotate = false, rightRotate = false;
    private boolean lockView = true;
    private FlyByCamera fbc;
    float angle;
    boolean stop = true;
    private final SpotLight sun;
    private final SpotLightShadowRenderer slsr;
    private final LightScatteringFilter sunlight;
    private FilterPostProcessor fpp;
    private WaterFilter water;
    private float initialWaterHeight = -0.75f; // choose a value for your scene
    private final FilterPostProcessor fpp2;

    public GameRunningState(SimpleApplication app) {

        this.rootNode = app.getRootNode();
        this.viewPort = app.getViewPort();
        this.guiNode = app.getGuiNode();
        this.assetManager = app.getAssetManager();
        this.inputManager = app.getInputManager();

        fbc = app.getFlyByCamera();

        sun = new SpotLight();
        sun.setSpotRange(5000);
        sun.setSpotOuterAngle(50000 * FastMath.DEG_TO_RAD);
        sun.setSpotInnerAngle(50000 * FastMath.DEG_TO_RAD);

        sun.setPosition(new Vector3f(0, 500, 0));

        slsr = new SpotLightShadowRenderer(assetManager, 2048);
        slsr.setLight(sun);
        slsr.setEdgeFilteringMode(EdgeFilteringMode.Bilinear);
        viewPort.addProcessor(slsr);

        localRootNode.addLight(sun);
        createSky();

        bulletAppState = new BulletAppState();
        app.getStateManager().attach(bulletAppState);
        bulletAppState.setDebugEnabled(false);
        characterNode = new Node("character node");
        characterNode.setLocalTranslation(new Vector3f(4, 5, 2));

        physicsCharacter = new BetterCharacterControl(0.3f, 2.5f, 8f);
        characterNode.addControl(physicsCharacter);
        getPhysicsSpace().add(physicsCharacter);

        Node model = (Node) assetManager.loadModel("Models/Jaime/Jaime.j3o");
        model.setLocalScale(1.50f);
        model.getChildren().get(0).setShadowMode(ShadowMode.CastAndReceive);
        localRootNode.setShadowMode(ShadowMode.CastAndReceive);
        characterNode.attachChild(model);

        localRootNode.attachChild(characterNode);

        camNode = new CameraNode("CamNode", app.getCamera());
        camNode.setControlDir(CameraControl.ControlDirection.SpatialToCamera);
        camNode.setLocalTranslation(new Vector3f(0, 2, -15));
        Quaternion quat = new Quaternion();

        quat.lookAt(Vector3f.UNIT_Z, Vector3f.UNIT_Y);
        camNode.setLocalRotation(quat);
        characterNode.attachChild(camNode);

        camNode.setEnabled(true);

        localRootNode.setShadowMode(ShadowMode.CastAndReceive);

        Material mat = assetManager.loadMaterial("Textures/Terrain/Pond/Pond.j3m");
        mat.getTextureParam("DiffuseMap").getTextureValue().setWrap(WrapMode.Repeat);
        mat.getTextureParam("NormalMap").getTextureValue().setWrap(WrapMode.Repeat);
        mat.setBoolean("UseMaterialColors", true);
        mat.setReceivesShadows(true);
        mat.setColor("Diffuse", ColorRGBA.White.clone());
        mat.setColor("Ambient", ColorRGBA.White.clone());
        mat.setFloat("Shininess", 0);

        Box floor = new Box(50, 1f, 50);
        TangentBinormalGenerator.generate(floor);
        floor.scaleTextureCoordinates(new Vector2f(5, 5));
        Geometry floorGeom = new Geometry("Floor", floor);
        floorGeom.setMaterial(mat);
        floorGeom.setShadowMode(ShadowMode.CastAndReceive);
        localRootNode.attachChild(floorGeom);

        Spatial signpost = assetManager.loadModel("Models/Sign Post/Sign Post.mesh.xml");
        mat = assetManager.loadMaterial("Models/Sign Post/Sign Post.j3m");
        mat.setReceivesShadows(true);
        signpost.setMaterial(mat);
        signpost.rotate(0, FastMath.HALF_PI, 0);
        signpost.setLocalTranslation(12, 3.5f, 30);
        signpost.setLocalScale(4);
        signpost.setShadowMode(ShadowMode.CastAndReceive);
        TangentBinormalGenerator.generate(signpost);
        localRootNode.attachChild(signpost);

        fpp = new FilterPostProcessor(assetManager);
        sunlight = new LightScatteringFilter(sun.getPosition());
        fpp.addFilter(sunlight);

        fpp2 = new FilterPostProcessor(assetManager);
        water = new WaterFilter(localRootNode, sun.getPosition());
        water.setWaterHeight(initialWaterHeight);
        fpp2.addFilter(water);

        signpost.addControl(new RigidBodyControl(0));

        bulletAppState.getPhysicsSpace().add(signpost);

        floorGeom.addControl(new RigidBodyControl(0));

        bulletAppState.getPhysicsSpace().add(floorGeom);
    }

    @Override
    public void initialize(AppStateManager stateManager, Application app) {

        super.initialize(stateManager, app);
        viewPort.addProcessor(fpp);
        viewPort.addProcessor(fpp2);
        setupKeys();
        loadHintText("Game running. Press BACKSPACE to pause and return to the start screen.");
    }

    private PhysicsSpace getPhysicsSpace() {

        return bulletAppState.getPhysicsSpace();
    }

    public void loadHintText(String txt) {

        viewPort.setBackgroundColor(backgroundColor);

        BitmapFont guiFont = assetManager.loadFont(
                "Interface/Fonts/Default.fnt");

        BitmapText displaytext = new BitmapText(guiFont);

        displaytext.setSize(guiFont.getCharSet().getRenderedSize());
        displaytext.move(10, displaytext.getLineHeight() + 20, 0);
        displaytext.setText(txt);
        localGuiNode.attachChild(displaytext);
    }

    private void setupKeys() {

        inputManager.addMapping("Strafe Left",
                new KeyTrigger(KeyInput.KEY_U),
                new KeyTrigger(KeyInput.KEY_Z));
        inputManager.addMapping("Strafe Right",
                new KeyTrigger(KeyInput.KEY_O),
                new KeyTrigger(KeyInput.KEY_X));
        inputManager.addMapping("Rotate Left",
                new KeyTrigger(KeyInput.KEY_J),
                new KeyTrigger(KeyInput.KEY_LEFT));
        inputManager.addMapping("Rotate Right",
                new KeyTrigger(KeyInput.KEY_L),
                new KeyTrigger(KeyInput.KEY_RIGHT));
        inputManager.addMapping("Walk Forward",
                new KeyTrigger(KeyInput.KEY_I),
                new KeyTrigger(KeyInput.KEY_UP));
        inputManager.addMapping("Walk Backward",
                new KeyTrigger(KeyInput.KEY_K),
                new KeyTrigger(KeyInput.KEY_DOWN));
        inputManager.addMapping("Jump",
                new KeyTrigger(KeyInput.KEY_F),
                new KeyTrigger(KeyInput.KEY_SPACE));
        inputManager.addMapping("Duck",
                new KeyTrigger(KeyInput.KEY_G),
                new KeyTrigger(KeyInput.KEY_LSHIFT),
                new KeyTrigger(KeyInput.KEY_RSHIFT));
        inputManager.addMapping("Lock View",
                new KeyTrigger(KeyInput.KEY_RETURN));

        inputManager.addListener(actionListener, "Rotate Left", "Strafe Right");
        inputManager.addListener(actionListener, "Rotate Left", "Rotate Right");
        inputManager.addListener(actionListener, "Walk Forward", "Walk Backward");
        inputManager.addListener(actionListener, "Jump", "Duck", "Lock View");
    }
    private ActionListener actionListener = new ActionListener() {
        @Override
        public void onAction(String name, boolean value, float tpf) {

            switch (name) {

                case "Strafe Left":

                    if (value) {

                        leftStrafe = true;
                    } else {

                        leftStrafe = false;
                    }
                    break;
                case "Strafe Right":

                    if (value) {

                        rightStrafe = true;
                    } else {

                        rightStrafe = false;
                    }
                    break;
                case "Rotate Left":

                    if (value) {

                        leftRotate = true;
                    } else {

                        leftRotate = false;
                    }
                    break;
                case "Rotate Right":

                    if (value) {

                        rightRotate = true;
                    } else {

                        rightRotate = false;
                    }
                    break;
                case "Walk Forward":

                    if (value) {

                        forward = true;
                    } else {

                        forward = false;
                    }
                    break;
                case "Walk Backward":

                    if (value) {

                        backward = true;
                    } else {

                        backward = false;
                    }
                    break;
                case "Jump":
                    physicsCharacter.jump();
                    break;
                case "Duck":

                    if (value) {

                        physicsCharacter.setDucked(true);
                    } else {
                        physicsCharacter.setDucked(false);
                    }
                    break;
                case "Lock View":

                    if (value && lockView) {
                        lockView = false;
                    } else if (value && !lockView) {

                        lockView = true;
                    }

                    fbc.setEnabled(!lockView);
                    camNode.setEnabled(lockView);

                    break;
            }
        }
    };

    private void createSky() {

        Texture west = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_west.jpg");
        Texture east = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_east.jpg");
        Texture north = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_north.jpg");
        Texture south = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_south.jpg");
        Texture up = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_up.jpg");
        Texture down = assetManager.loadTexture("Textures/Sky/Lagoon/lagoon_down.jpg");

        Spatial sky = SkyFactory.createSky(assetManager, west, east, north, south, up, down);
        sky.setLocalTranslation(0, -1000, 0);
        localRootNode.attachChild(sky);
    }
    float s = 1f;
    Node pivot = new Node();

    @Override
    public void update(float tpf) {


        super.update(tpf);

        pivot.rotate((FastMath.QUARTER_PI * tpf) / 16, 0, 0);
        sun.setDirection(pivot.getLocalRotation().getRotationColumn(2));
        slsr.setLight(sun);

        sunlight.setLightPosition(sun.getPosition());

        water.setLightDirection(sun.getDirection());

        Vector3f modelForwardDir = characterNode.getWorldRotation().mult(Vector3f.UNIT_Z);
        Vector3f modelLeftDir = characterNode.getWorldRotation().mult(Vector3f.UNIT_X);

        walkDirection.set(0, 0, 0);

        if (leftStrafe) {

            walkDirection.addLocal(modelLeftDir.mult(15));
        } else if (rightStrafe) {

            walkDirection.addLocal(modelLeftDir.negate().multLocal(15));
        }

        if (forward) {

            walkDirection.addLocal(modelForwardDir.mult(15));
        } else if (backward) {

            walkDirection.addLocal(modelForwardDir.mult(15).negateLocal());
            walkDirection.addLocal(modelForwardDir.negate().multLocal(15));
        }

        physicsCharacter.setWalkDirection(walkDirection);

        if (leftRotate) {

            Quaternion rotateL = new Quaternion().fromAngleAxis(FastMath.PI * tpf, Vector3f.UNIT_Y);
            rotateL.multLocal(viewDirection);
        } else if (rightRotate) {

            Quaternion rotateR = new Quaternion().fromAngleAxis(-FastMath.PI * tpf, Vector3f.UNIT_Y);
            rotateR.multLocal(viewDirection);
        }

        physicsCharacter.setViewDirection(viewDirection);

        if (!lockView) {

            viewPort.getCamera().lookAt(characterNode.getWorldTranslation().add(new Vector3f(0, 2, 0)), Vector3f.UNIT_Y);
        }

        Vector3f v = viewPort.getCamera().getLocation();
        viewPort.setBackgroundColor(new ColorRGBA(v.getX() / 10, v.getY() / 10, v.getZ() / 10, 1));
    }

    @Override
    public void stateAttached(AppStateManager stateManager) {

        rootNode.attachChild(localRootNode);
        guiNode.attachChild(localGuiNode);
        viewPort.setBackgroundColor(backgroundColor);
    }

    @Override
    public void stateDetached(AppStateManager stateManager) {

        viewPort.removeProcessor(fpp);
        viewPort.removeProcessor(fpp2);

        rootNode.detachChild(localRootNode);
        guiNode.detachChild(localGuiNode);
    }
}