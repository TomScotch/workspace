package com.bigboots.testscene;

import com.jme3.app.SimpleApplication;
import java.util.logging.Logger;
import java.util.logging.Level;
import com.jme3.math.Vector3f;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.renderer.RenderManager;
//scene
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
//Lights
import com.jme3.light.AmbientLight;
import com.jme3.light.DirectionalLight;
import com.jme3.math.ColorRGBA;

//animation class import
import com.jme3.animation.AnimChannel;
import com.jme3.animation.AnimControl;
import com.jme3.animation.AnimEventListener;
import com.jme3.animation.LoopMode;
//physic
import com.jme3.asset.DesktopAssetManager;
import com.jme3.asset.ModelKey;
import com.jme3.bullet.BulletAppState;

import com.jme3.bullet.collision.shapes.CapsuleCollisionShape;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.bullet.collision.shapes.CollisionShape;
import com.jme3.bullet.objects.PhysicsCharacter;
import com.jme3.bullet.util.CollisionShapeFactory;

//settings
import com.jme3.system.AppSettings;

//Input
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.AnalogListener;
import com.jme3.input.controls.KeyTrigger;

//terrain
import com.jme3.material.Material;
//import com.jme3.terrain.geomipmap.TerrainLodControl;
import com.jme3.math.Transform;
import com.jme3.terrain.geomipmap.TerrainQuad;
//import com.jme3.terrain.geomipmap.lodcalc.DistanceLodCalculator;
//import com.jme3.terrain.heightmap.HillHeightMap; // for exercise 2

//Camera
import com.jme3.scene.CameraNode;
import com.jme3.scene.control.CameraControl.ControlDirection;
//Sky
import com.jme3.util.SkyFactory;
//filters
import com.jme3.post.FilterPostProcessor;
import com.jme3.post.filters.BloomFilter;
//fog
import com.jme3.post.filters.FogFilter;
//bleur
import com.jme3.post.filters.DepthOfFieldFilter;
import com.jme3.scene.Geometry;
import com.jme3.scene.shape.Box;
import java.util.HashMap;
//audio

/**
 * 
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 * @author Vemund Kvam <vekjeft@code.google.com>
 * 
 */
public class TestCharacterOnTrack2 extends SimpleApplication implements AnimEventListener, ActionListener, AnalogListener{ 

    public static void main(String[] args) {
        TestCharacterOnTrack2 app = new TestCharacterOnTrack2();
//        AppSettings appSettings = new AppSettings(true);
//        appSettings.setVSync(true);
//        app.setSettings(appSettings);
        app.start();
    }
    private HashMap<Long, Node> entities = new HashMap<Long, Node>();
    
    protected Node human,humanStalker,ndscene;
    protected TerrainQuad terrain;
    protected Spatial player;
    protected CameraNode camNode;
    //protected AnimChannel playerChannel;
    
    
    // Temp workaround, speed is reset after blending.
    private float smallManSpeed = .6f;
    
    private BulletAppState bulletAppState;
    private boolean walk, jump = false;
    private static final Logger logger = Logger.getLogger(SimpleApplication.class.getName());
    
    private static final class Directions{
    private static final Quaternion rot = new Quaternion().fromAngleAxis(-FastMath.HALF_PI, Vector3f.UNIT_Y);
    private static final Quaternion upDir = Quaternion.DIRECTION_Z.mult(rot);
    private static final Quaternion rightDir = upDir.mult(rot);
    private static final Quaternion downDir = rightDir.mult(rot);
    private static final Quaternion leftDir = downDir.mult(rot);
    }
    

    @Override
    public void simpleInitApp() {
    // Set up Physics
    bulletAppState = new BulletAppState();
    stateManager.attach(bulletAppState);
    //bulletAppState.getPhysicsSpace().enableDebug(assetManager);
    //setupLight();
    setupKeys();
    //setupTerrain();
    //setupSidePlanes();
    
    
    //Vector3f playerLoc = new Vector3f(-256, (terrain.getHeight(new Vector2f(-256,0))+10), 0);
    Vector3f playerLoc = new Vector3f(0, 30, 0);
    humanStalker = new Node("HumanStalker");
    human = makeASinbad("human",playerLoc,2,1);
    player = human.getChild("humanplayer");    
    bulletAppState.getPhysicsSpace().addAll(human);
    rootNode.attachChild(human);
    rootNode.attachChild(humanStalker);
    
    //setupEnemies(playerLoc);    
//    setupEffects();
    
       ModelKey mk = new ModelKey("Scenes/TestScene/character.mesh.xml");
       Node sinbadModel3 = (Node) assetManager.loadModel(mk);
       Node humanx = new Node();
       
    for (int i=0; i<50; i++) {
    
        
       Node sinbadModelx =  (Node) sinbadModel3.clone(false);       
       

       AnimControl control = sinbadModelx.getControl(AnimControl.class);
       AnimChannel playerChannel = control.createChannel();
       playerChannel.setAnim("run_01");
       playerChannel.setLoopMode(LoopMode.Loop);
       playerChannel.setSpeed(speed);        
       sinbadModelx.setLocalTranslation(new Vector3f(0, 3, 0-i*2));
       humanx.attachChild(sinbadModelx);
       
       
    }

    rootNode.attachChild(humanx);
    
    //Load sky
    Spatial sky = SkyFactory.createSky(assetManager, "Textures/sky/skysphere.jpg", true);
    rootNode.attachChild(sky);
    

    Node world = new Node("world");
    //world.attachChild(terrain); 
    //Attach to scene root node
    rootNode.attachChild(world);       

    //CollisionShape sceneShape = CollisionShapeFactory.createMeshShape(terrain);
    //RigidBodyControl landscape = new RigidBodyControl(sceneShape, 0);
    //terrain.addControl(landscape);

    // Disable the default flyby cam
    flyCam.setEnabled(false);
    //create the camera Node
    camNode = new CameraNode("Camera Node", cam);
    //This mode means that camera copies the movements of the target:
    camNode.setControlDir(ControlDirection.SpatialToCamera);
    
    //Move camNode, e.g. behind and above the target:
    camNode.setLocalTranslation(new Vector3f(25, 10, 0));
    //Rotate the camNode to look at the target:
    camNode.lookAt(humanStalker.getLocalTranslation(), Vector3f.UNIT_Y);
    //Attach the camNode to the target:
    humanStalker.attachChild(camNode);
    
    finalizeInit();
    }
    
    public void setupEffects(){
    
    //bloom
    FilterPostProcessor fpp = new FilterPostProcessor(assetManager);
    BloomFilter bf = new BloomFilter(BloomFilter.GlowMode.Objects);
    bf.setBloomIntensity(2.0f);
    bf.setExposurePower(1.3f);
    fpp.addFilter(bf);
    

    //Fog
    //FilterPostProcessor fogp =new FilterPostProcessor(assetManager);
    //fpp.setNumSamples(4);
    FogFilter fog=new FogFilter();
    fog.setFogColor(new ColorRGBA(0.9f, 0.9f, 0.9f, 1.0f));
    fog.setFogDistance(510);
    fog.setFogDensity(1.2f);
    fpp.addFilter(fog);
    

    //bleur
    //FilterPostProcessor dofp = new FilterPostProcessor(assetManager);
    DepthOfFieldFilter dofFilter = new DepthOfFieldFilter();
    dofFilter.setFocusDistance(0);
    dofFilter.setFocusRange(150);
    dofFilter.setBlurScale(1.4f);
    fpp.addFilter(dofFilter);
    
    viewPort.addProcessor(fpp);
    //viewPort.addProcessor(dofp);
    //viewPort.addProcessor(fogp);
    
    }

  
    public void setupKeys(){
    //Set up keys
    inputManager.addMapping("Left", new KeyTrigger(KeyInput.KEY_J));
    inputManager.addMapping("Right", new KeyTrigger(KeyInput.KEY_L));
    inputManager.addMapping("Up", new KeyTrigger(KeyInput.KEY_I));
    inputManager.addMapping("Down", new KeyTrigger(KeyInput.KEY_K));
    inputManager.addMapping("Jump", new KeyTrigger(KeyInput.KEY_SPACE));
    inputManager.addListener(this, "Left");
    inputManager.addListener(this, "Right");
    inputManager.addListener(this, "Up");
    inputManager.addListener(this, "Down");
    inputManager.addListener(this, "Jump");        
    }
    public void setupEnemies(Vector3f loc){

          for(int i=0;i<1;i++){
            Vector3f enemyLoc = loc;
            enemyLoc.x+=0;//Math.random()*100-50;
            enemyLoc.z+=0;//Math.random()*10-5;
            enemyLoc.y = 30;//terrain.getHeight(new Vector2f(enemyLoc.x,enemyLoc.z))+10;         
            Node enemy = makeASinbad("Enemy"+i,enemyLoc,.5f,.01f);
            rootNode.attachChild(enemy);
            bulletAppState.getPhysicsSpace().add(enemy.getControl(CharacterControl.class));
            entities.put(new Long(i), enemy);
        }
    }
    public Node makeASinbad(String name,Vector3f pos,float scale,float speed){
    Node sinbadOut = new Node(name);
    //Spatial sinbadModel2 = assetManager.loadModel("Models/Sinbad/Sinbad.mesh.j3o");
    Spatial sinbadModel2 = assetManager.loadModel("Scenes/TestScene/character.mesh.xml");
    
    Node sinbadModel = new Node();
    sinbadModel.attachChild(sinbadModel2);
    sinbadModel2.setLocalTranslation(0, -.85f, 0);
    
    
    sinbadModel2.setName(name+"player");

    sinbadOut.attachChild(sinbadModel);
//    sinbadOut.attachChild(sword);

    sinbadOut.setLocalTranslation(pos);

    //Set up animation
    AnimControl control = sinbadModel2.getControl(AnimControl.class);

    // PlayerChannel later refered to by player.getControl(AnimControl.class).getChannel(0);
    AnimChannel playerChannel = control.createChannel();
    
    playerChannel.setAnim("run_01");
//    playerChannel.setAnim("RunBase");

    playerChannel.setLoopMode(LoopMode.Cycle);
    playerChannel.setSpeed(speed);    
    
    // CapWe also put the player in its starting position.
    CapsuleCollisionShape capsuleShape = new CapsuleCollisionShape(.7f, 2f, 1);
    CharacterControl pControler = new CharacterControl(capsuleShape, .05f);
    
    pControler.setJumpSpeed(35);
    pControler.setFallSpeed(40);
    pControler.setGravity(35);
    //pControler.setPhysicsLocation(player.getWorldTranslation());//new Vector3f(0, 10, 0));
    pControler.setUseViewDirection(true);   
    /*
        Spatial debugColl = pControler.createDebugShape(assetManager);
        rootNode.attachChild(debugColl);    
        debugColl.setLocalTranslation(0, 2, 0);
    */
    // Add phys. controller to player.
    //sinbadModel.addControl(pControler);
    sinbadOut.addControl(pControler);
    sinbadOut.scale(scale);    
    return sinbadOut;
    }
    

    
    public void setupLight(){
    // We add light so we see the scene
    AmbientLight al = new AmbientLight();
    al.setColor(ColorRGBA.White.mult(1.3f));
    rootNode.addLight(al); 
    DirectionalLight dl = new DirectionalLight();
    dl.setColor(ColorRGBA.White);
    dl.setDirection(new Vector3f(2.8f, -2.8f, -2.8f).normalizeLocal());
    rootNode.addLight(dl);   
    }  
  
  // Abstract funtion coming with animation
    public void onAnimCycleDone(AnimControl control, AnimChannel chan, String animName) {
    /*
         if (animName.equals("RunTop")) {
      chan.setAnim("IdleTop", 0.50f);
      chan.setLoopMode(LoopMode.DontLoop);
      chan.setSpeed(1f);
    }
*/
     }
 // Abstract funtion coming with animation
    public void onAnimChange(AnimControl control, AnimChannel channel, String animName) {
    // unused
    }
    
  /** These are our custom actions triggered by key presses.
   * We do not walk yet, we just keep track of the direction the user pressed. */
    private int pressed=0;
    public void onAction(String binding, boolean value, float tpf) {
      if(value == true){
          pressed++;
      }
      else{
          pressed--;                      
      }
      if(pressed==1&&value&!binding.equals("Jump")&&!walk){
          walk = true;
          
          if(!jump){
          logger.log(Level.INFO,"Character walking init.");
          //player.getControl(AnimControl.class).getChannel(0).setAnim("RunTop", 0.50f); // TODO: Must activate "RunBase" after a certain time.
          player.getControl(AnimControl.class).getChannel(0).setAnim("run_01", 0.20f); // TODO: Must be activated after a certain time after "RunTop"
          player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.Loop);
          }
      }
      else if (pressed==0&!value&!binding.equals("Jump")) {
          walk = false;
          if(!jump){
          logger.log(Level.INFO,"Character walking end.");
          //playerChannel.setAnim("IdleTop", 0.50f);
          player.getControl(AnimControl.class).getChannel(0).setAnim("base_stand", 0.20f);          
          player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);  
//          human.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
          }
      }
    if (binding.equals("Jump") &! jump ) {
        if (value){
        logger.log(Level.INFO,"Character jumping start.");
        jump = true;
        // channel.setAnim("JumpStart", 0.5f); // TODO: Must activate "JumpLoop" after a certain time.
        human.getControl(CharacterControl.class).jump();
        player.getControl(AnimControl.class).getChannel(0).setAnim("jump", 0.20f); // TODO: Must be activated after a certain time after "JumpStart"
        player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);
        }
    }

    }

    float hasJumped = 0;
    boolean hasBeenOnGround = false;
    @Override
    public void simpleUpdate(float tpf) {
        
        System.nanoTime();
        
        System.out.println(player.getControl(AnimControl.class).getChannel(0).getTime());
        System.out.println(player.getControl(AnimControl.class).getChannel(0).getAnimationName());
        System.out.println(player.getControl(AnimControl.class).getChannel(0).getLoopMode());    
        System.out.println(player.getControl(AnimControl.class).getChannel(0).getSpeed());           
        for(Node a:entities.values()){
            Vector3f humanPos = human.getLocalTranslation().clone();
            Quaternion newRot = new Quaternion().fromAngleAxis(FastMath.rand.nextFloat()*2-.5f, Vector3f.UNIT_Y);
            humanPos.y = a.getLocalTranslation().y;            
//            a.lookAt(humanPos,Vector3f.UNIT_Y);
//            a.getLocalRotation().slerp(newRot,tpf);            
            
            float distSquared = humanPos.distanceSquared(a.getLocalTranslation());
            if(distSquared>9){
            a.getControl(CharacterControl.class).setViewDirection(a.getLocalRotation().mult(Vector3f.UNIT_Z));            
            a.getControl(CharacterControl.class).setWalkDirection(a.getLocalRotation().mult(Vector3f.UNIT_Z).mult(tpf*1f));
                //**if(!a.getChild(0).getControl(AnimControl.class).getChannel(0).getAnimationName().equals("RunBase")&&!a.getChild(0).getControl(AnimControl.class).getChannel(0).getAnimationName().equals("RunTop"))
                //**{
                //**a.getChild(0).getControl(AnimControl.class).getChannel(0).setAnim("RunTop", 0.50f); // TODO: Must activate "RunBase" after a certain time.                    
                //**a.getChild(0).getControl(AnimControl.class).getChannel(0).setAnim("RunBase", 0.50f);
                //**a.getChild(0).getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.Loop);
                //**}
                // Workaround
                //if(a.getChild(0).getControl(AnimControl.class).getChannel(0).getSpeed()!=smallManSpeed){
                //a.getChild(0).getControl(AnimControl.class).getChannel(0).setSpeed(smallManSpeed);
                //}            
            }
            else{
            a.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
                //**if(!a.getChild(0).getControl(AnimControl.class).getChannel(0).getAnimationName().equals("IdleTop"))
                //**{
                //**a.getChild(0).getControl(AnimControl.class).getChannel(0).setAnim("IdleTop", 0.50f);
                //**a.getChild(0).getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);
                //**}
            }
        }
    
        Vector3f pos = human.getControl(CharacterControl.class).getPhysicsLocation();
        humanStalker.setLocalTranslation(pos);
        
        
        PhysicsCharacter anv = human.getControl(CharacterControl.class);
        
        if(anv.onGround()){
            if(jump)
            {
                
                if(!hasBeenOnGround)
                hasBeenOnGround=true;
                
                boolean hasBeenOnGroundCopy = hasBeenOnGround;
         
                if(hasBeenOnGroundCopy)
                {
                hasJumped+=tpf;

                logger.log(Level.INFO,"Character jumping end.");
                jump = false;
                hasJumped = 0;
                    if(walk){
                    //channel.setAnim("RunTop", 0.50f);
          logger.log(Level.INFO,"Character jumping end. Start stand.");
                        
                    player.getControl(AnimControl.class).getChannel(0).setAnim("run_01", 0.50f);
                    player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.Loop);
                    }
                    else{
          logger.log(Level.INFO,"Character jumping end. Start stand.");
                        
                    player.getControl(AnimControl.class).getChannel(0).setAnim("base_stand", 0.50f);
                    player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);                           
                    human.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
                    }
                hasBeenOnGround = false;
                }
            }
            
            if(!walk && !jump){
                    human.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
            }
            
        }
        else if(!jump){
            logger.log(Level.INFO,"Character jumping start.");
            jump = true;
            //channel.setAnim("JumpStart", 0.5f); // TODO: Must activate "JumpLoop" after a certain time.
        player.getControl(AnimControl.class).getChannel(0).setAnim("jump", 0.50f); // TODO: Must be activated after a certain time after "JumpStart"
        player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);
        
        }
    }

    @Override
    public void simpleRender(RenderManager rm) {
        //TODO: add render code
    }
        int timeBullet = 0;
    public void onAnalog(String binding, float value, float tpf) {
                
        if(!jump)
        {
        if (binding.equals("Left")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.leftDir, tpf*8);
        human.setLocalRotation(newRot);
        }
        else if (binding.equals("Right")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.rightDir, tpf*8);
        human.setLocalRotation(newRot);        
        } else if (binding.equals("Up")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.upDir, tpf*8);
        human.setLocalRotation(newRot);
        } else if (binding.equals("Down")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.downDir, tpf*8);
        human.setLocalRotation(newRot);
        }
        
        if(walk){
        human.getControl(CharacterControl.class).setViewDirection(human.getWorldRotation().mult(Vector3f.UNIT_Z));                     
        human.getControl(CharacterControl.class).setWalkDirection(human.getControl(CharacterControl.class).getViewDirection().multLocal(.2f));                  
        }        
        else{
        human.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
        }
        }
    }
    
    
    
    
    
    

    
    
    Geometry geom_a;
    Material mat_box;
    Node ndmd,physicsModels,physicsModelsFinal;
    
    // models
     Spatial obj01;
     Spatial obj02;
     Spatial obj03;
     Spatial ledder;
    
     // collision shapes
     Geometry obj01_l;
     Geometry obj02_l;
     Geometry obj03_l;
     Geometry ledder_l;
     

    
    
     public void Models () {
        
         //Create an empty node for models 
         ndmd = new Node("Models");
         
         
        // Material
        Material mat = assetManager.loadMaterial("Scenes/TestScene/TestSceneMaterial.j3m"); 
         
        ModelKey bk = new ModelKey("Scenes/TestScene/test_scene_01_3.blend");  
        Node ndmd =  (Node) assetManager.loadModel(bk);

        CollisionShape myComplexShape = CollisionShapeFactory.createMeshShape(ndmd);
        //physicsModelsFinal.detachAllChildren();
        RigidBodyControl worldPhysics = new RigidBodyControl(myComplexShape,0);  
//        worldPhysics.createDebugShape(assetManager);        
        bulletAppState.getPhysicsSpace().add(worldPhysics); 

        rootNode.attachChild(ndmd);

        }
     
    
    public void addPhysics(){
//        rootNode.attachChild(ndmd);
        
//        physicsModelsFinal = null;
    }
    
    public void finalizeInit() {

        Models();
        
        DirectionalLight dl = new DirectionalLight();
        dl.setDirection(new Vector3f(-0.8f, -0.6f, -0.08f).normalizeLocal());
        dl.setColor(new ColorRGBA(0.7f,0.7f,0.7f,1));
        rootNode.addLight(dl);
        
        AmbientLight al = new AmbientLight();
        al.setColor(new ColorRGBA(0.2f,0.2f,0.2f,1));
        rootNode.addLight(al);
        
        
        flyCam.setMoveSpeed(30);
        viewPort.setBackgroundColor(ColorRGBA.Gray);
        addPhysics();
}


    }





    
    
    
    
    
