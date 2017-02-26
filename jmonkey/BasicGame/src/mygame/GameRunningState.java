package mygame;

import com.jme3.app.Application;
import com.jme3.app.SimpleApplication;
import com.jme3.app.state.AbstractAppState;
import com.jme3.app.state.AppStateManager;
import com.jme3.asset.AssetManager;
import com.jme3.bounding.BoundingBox;
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
import com.jme3.light.DirectionalLight;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.math.Vector3f;
import com.jme3.post.FilterPostProcessor;
import com.jme3.renderer.ViewPort;
import com.jme3.scene.CameraNode;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.scene.control.CameraControl;
import com.jme3.shadow.DirectionalLightShadowFilter;
import com.jme3.shadow.DirectionalLightShadowRenderer;
import com.jme3.shadow.EdgeFilteringMode;
import com.jme3.terrain.geomipmap.TerrainLodControl;
import com.jme3.terrain.geomipmap.TerrainQuad;
import com.jme3.terrain.geomipmap.lodcalc.DistanceLodCalculator;
import com.jme3.terrain.heightmap.AbstractHeightMap;
import com.jme3.terrain.heightmap.ImageBasedHeightMap;
import com.jme3.texture.Texture;
import com.jme3.util.SkyFactory;

public class GameRunningState extends AbstractAppState {

    private ViewPort viewPort;
    private Node rootNode;
    private Node guiNode;
    private AssetManager assetManager;
    private Node localRootNode = new Node("Game Screen RootNode");
    private Node localGuiNode = new Node("Game Screen GuiNode");
    private final ColorRGBA backgroundColor = ColorRGBA.Blue;
    private TerrainQuad terrain;
    private Material matTerrain;
    private Material matWire;
    boolean wireframe = false;
    boolean triPlanar = false;
    boolean wardiso = false;
    boolean minnaert = false;
    protected BitmapText hintText;
    private float grassScale = 64;
    private float dirtScale = 16;
    private float rockScale = 128;
    private InputManager inputManager;
    private DirectionalLight sun;
    private FilterPostProcessor fpp;
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

    public GameRunningState(SimpleApplication app) {

        this.rootNode = app.getRootNode();
        this.viewPort = app.getViewPort();
        this.guiNode = app.getGuiNode();
        this.assetManager = app.getAssetManager();
        this.inputManager = app.getInputManager();
        fbc = app.getFlyByCamera();

        matTerrain = new Material(assetManager, "Common/MatDefs/Terrain/TerrainLighting.j3md");
        matTerrain.setBoolean("useTriPlanarMapping", false);
        matTerrain.setFloat("Shininess", 0.0f);
        matTerrain.setTexture("AlphaMap", assetManager.loadTexture("Textures/Terrain/splat/alpha1.png"));
        matTerrain.setTexture("AlphaMap_1", assetManager.loadTexture("Textures/Terrain/splat/alpha2.png"));

        Texture heightMapImage = assetManager.loadTexture("Textures/Terrain/splat/mountains512.png");
        Texture dirt = assetManager.loadTexture("Textures/Terrain/splat/dirt.jpg");
        dirt.setWrap(Texture.WrapMode.Repeat);
        matTerrain.setTexture("DiffuseMap", dirt);
        matTerrain.setFloat("DiffuseMap_0_scale", dirtScale);

        Texture grass = assetManager.loadTexture("Textures/Terrain/splat/grass.jpg");
        grass.setWrap(Texture.WrapMode.Repeat);
        matTerrain.setTexture("DiffuseMap_1", grass);
        matTerrain.setFloat("DiffuseMap_1_scale", grassScale);

        Texture rock = assetManager.loadTexture("Textures/Terrain/splat/road.jpg");
        rock.setWrap(Texture.WrapMode.Repeat);
        matTerrain.setTexture("DiffuseMap_2", rock);
        matTerrain.setFloat("DiffuseMap_2_scale", rockScale);

        Texture brick = assetManager.loadTexture("Textures/Terrain/BrickWall/BrickWall.jpg");
        brick.setWrap(Texture.WrapMode.Repeat);
        matTerrain.setTexture("DiffuseMap_3", brick);
        matTerrain.setFloat("DiffuseMap_3_scale", rockScale);

        Texture riverRock = assetManager.loadTexture("Textures/Terrain/Pond/Pond.jpg");
        riverRock.setWrap(Texture.WrapMode.Repeat);
        matTerrain.setTexture("DiffuseMap_4", riverRock);
        matTerrain.setFloat("DiffuseMap_4_scale", rockScale);

        Texture normalMap0 = assetManager.loadTexture("Textures/Terrain/splat/grass_normal.jpg");
        normalMap0.setWrap(Texture.WrapMode.Repeat);
        Texture normalMap1 = assetManager.loadTexture("Textures/Terrain/splat/dirt_normal.png");
        normalMap1.setWrap(Texture.WrapMode.Repeat);
        Texture normalMap2 = assetManager.loadTexture("Textures/Terrain/splat/road_normal.png");
        normalMap2.setWrap(Texture.WrapMode.Repeat);

        matTerrain.setTexture("NormalMap_1", normalMap2);
        matTerrain.setTexture("NormalMap_2", normalMap2);
        matTerrain.setTexture("NormalMap_4", normalMap2);

        matWire = new Material(assetManager, "Common/MatDefs/Misc/Unshaded.j3md");
        matWire.getAdditionalRenderState().setWireframe(true);
        matWire.setColor("Color", ColorRGBA.Green);

        createSky();

        AbstractHeightMap heightmap = null;
        try {
            heightmap = new ImageBasedHeightMap(heightMapImage.getImage(), 0.5f);
            heightmap.load();
            heightmap.smooth(0.9f, 1);

        } catch (Exception e) {
        }

        terrain = new TerrainQuad("terrain", 65, 513, heightmap.getHeightMap());
        TerrainLodControl control = new TerrainLodControl(terrain, viewPort.getCamera());
        control.setLodCalculator(new DistanceLodCalculator(65, 2.7f));
        terrain.addControl(control);
        terrain.setMaterial(matTerrain);
        terrain.setModelBound(new BoundingBox());
        terrain.updateModelBound();
        terrain.setLocalTranslation(0, -100, 0);
        terrain.setLocalScale(1f, 1f, 1f);
        localRootNode.attachChild(terrain);

        sun = new DirectionalLight();
        sun.setDirection((new Vector3f(-0.5f, -0.5f, -0.5f)).normalizeLocal());
        sun.setColor(ColorRGBA.White);
        localRootNode.addLight(sun);

        DirectionalLightShadowRenderer dlsr = new DirectionalLightShadowRenderer(assetManager, 1024, 3);
        dlsr.setLight(sun);
        dlsr.setLambda(0.55f);
        dlsr.setShadowIntensity(0.6f);
        dlsr.setEdgeFilteringMode(EdgeFilteringMode.Nearest);
        viewPort.addProcessor(dlsr);

        DirectionalLightShadowFilter dlsf = new DirectionalLightShadowFilter(assetManager, 1024, 3);
        dlsf.setLight(sun);
        dlsf.setLambda(0.55f);
        dlsf.setShadowIntensity(0.6f);
        dlsf.setEdgeFilteringMode(EdgeFilteringMode.Nearest);

        fpp = new FilterPostProcessor(assetManager);
        fpp.addFilter(dlsf);


        viewPort.addProcessor(fpp);

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
        characterNode.attachChild(model);

        localRootNode.attachChild(characterNode);

        camNode = new CameraNode("CamNode", app.getCamera());
        camNode.setControlDir(CameraControl.ControlDirection.SpatialToCamera);
        camNode.setLocalTranslation(new Vector3f(0, 2, -6));
        Quaternion quat = new Quaternion();

        quat.lookAt(Vector3f.UNIT_Z, Vector3f.UNIT_Y);
        camNode.setLocalRotation(quat);
        characterNode.attachChild(camNode);

        camNode.setEnabled(true);

   terrain.addControl(new RigidBodyControl(0));
       
       bulletAppState.getPhysicsSpace().add(terrain);     
    }

    @Override
    public void initialize(AppStateManager stateManager, Application app) {

        super.initialize(stateManager, app);

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
        inputManager.addMapping("wireframe", new KeyTrigger(KeyInput.KEY_T));
        inputManager.addListener(actionListener, "wireframe");
        inputManager.addMapping("triPlanar", new KeyTrigger(KeyInput.KEY_P));
        inputManager.addListener(actionListener, "triPlanar");
        inputManager.addMapping("WardIso", new KeyTrigger(KeyInput.KEY_9));
        inputManager.addListener(actionListener, "WardIso");
        inputManager.addMapping("Minnaert", new KeyTrigger(KeyInput.KEY_0));
        inputManager.addListener(actionListener, "Minnaert");
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

        inputManager.addListener(actionListener, "Strafe Left", "Strafe Right");
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

            if (name.equals("wireframe") && !value) {
                wireframe = !wireframe;
                if (!wireframe) {
                    terrain.setMaterial(matWire);
                } else {
                    terrain.setMaterial(matTerrain);
                }
            } else if (name.equals("triPlanar") && !value) {
                triPlanar = !triPlanar;
                if (triPlanar) {
                    matTerrain.setBoolean("useTriPlanarMapping", true);

                    matTerrain.setFloat("DiffuseMap_0_scale", 1f / (float) (512f / grassScale));
                    matTerrain.setFloat("DiffuseMap_1_scale", 1f / (float) (512f / dirtScale));
                    matTerrain.setFloat("DiffuseMap_2_scale", 1f / (float) (512f / rockScale));
                    matTerrain.setFloat("DiffuseMap_3_scale", 1f / (float) (512f / rockScale));
                    matTerrain.setFloat("DiffuseMap_4_scale", 1f / (float) (512f / rockScale));
                } else {
                    matTerrain.setBoolean("useTriPlanarMapping", false);
                    matTerrain.setFloat("DiffuseMap_0_scale", grassScale);
                    matTerrain.setFloat("DiffuseMap_1_scale", dirtScale);
                    matTerrain.setFloat("DiffuseMap_2_scale", rockScale);
                    matTerrain.setFloat("DiffuseMap_3_scale", rockScale);
                    matTerrain.setFloat("DiffuseMap_4_scale", rockScale);
                }
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
        localRootNode.attachChild(sky);
    }

    @Override
    public void update(float tpf) {


        Vector3f modelForwardDir = characterNode.getWorldRotation().mult(Vector3f.UNIT_Z);
        Vector3f modelLeftDir = characterNode.getWorldRotation().mult(Vector3f.UNIT_X);

        walkDirection.set(0, 0, 0);
        if (leftStrafe) {
            walkDirection.addLocal(modelLeftDir.mult(3));
        } else if (rightStrafe) {
            walkDirection.addLocal(modelLeftDir.negate().multLocal(3));
        }
        if (forward) {
            walkDirection.addLocal(modelForwardDir.mult(3));
        } else if (backward) {
            walkDirection.addLocal(modelForwardDir.negate().multLocal(3));
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
        rootNode.detachChild(localRootNode);
        guiNode.detachChild(localGuiNode);
    }
}