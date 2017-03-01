/*
 * Copyright (C) 2011  BigBoots Team
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *  
 * See <http://www.gnu.org/licenses/>.
 */
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
import com.jme3.bullet.BulletAppState;
import com.jme3.bullet.collision.shapes.HeightfieldCollisionShape;
import com.jme3.bullet.collision.shapes.PlaneCollisionShape;
import com.jme3.math.Plane;
import com.jme3.bullet.collision.shapes.CapsuleCollisionShape;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.bullet.control.RigidBodyControl;
//import com.jme3.bullet.util.CollisionShapeFactory;

//settings
import com.jme3.input.ChaseCamera;
import com.jme3.system.AppSettings;

//Input
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.AnalogListener;
import com.jme3.input.controls.KeyTrigger;

//terrain
import com.jme3.material.Material;
//import com.jme3.terrain.geomipmap.TerrainLodControl;
import com.jme3.math.Matrix3f;
import com.jme3.math.Vector2f;
import com.jme3.terrain.heightmap.AbstractHeightMap;
import com.jme3.terrain.geomipmap.TerrainQuad;
//import com.jme3.terrain.geomipmap.lodcalc.DistanceLodCalculator;
//import com.jme3.terrain.heightmap.HillHeightMap; // for exercise 2
import com.jme3.terrain.heightmap.ImageBasedHeightMap;
import com.jme3.texture.Texture;
import com.jme3.texture.Texture.WrapMode;
import jme3tools.converters.ImageToAwt;

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
import java.util.HashMap;
//audio

/**
 * 
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 * @author Vemund Kvam <vekjeft@code.google.com>
 * 
 */
public class TestAPIFrameWork extends SimpleApplication implements AnimEventListener, ActionListener, AnalogListener{ 

    public static void main(String[] args) {
        TestAPIFrameWork app = new TestAPIFrameWork();
        AppSettings appSettings = new AppSettings(true);
        appSettings.setFrameRate(60);
        app.setSettings(appSettings);
        app.start();
    }
    private HashMap<Long, Node> entities = new HashMap<Long, Node>();
    
    protected Node human,humanStalker;
    protected TerrainQuad terrain;
    protected Spatial player;
    protected CameraNode camNode;
    //protected AnimChannel playerChannel;
    private ChaseCamera chaseCam;
    
    // Temp workaround, speed is reset after blending.
    private float smallManSpeed = .6f;
    
    private BulletAppState bulletAppState;
    private boolean walk, jump = false;
    private static final Logger logger = Logger.getLogger(SimpleApplication.class.getName());
    
    private static final class Directions{
    private static final Quaternion rot = new Quaternion().fromAngleAxis(-FastMath.HALF_PI, Vector3f.UNIT_Y);
    private static final Quaternion upDir = Quaternion.DIRECTION_Z;
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
    setupLight();
    setupKeys();
    setupTerrain();
    setupSidePlanes();
    
    
    Vector3f playerLoc = new Vector3f(-256, (terrain.getHeight(new Vector2f(-256,0))+10), 0);
    humanStalker = new Node("HumanStalker");
    human = makeASinbad("human",playerLoc,1,1);
    player = human.getChild("humanplayer");    
    bulletAppState.getPhysicsSpace().addAll(human);
    rootNode.attachChild(human);
    rootNode.attachChild(humanStalker);
    
    setupEnemies(playerLoc);    
    setupEffects();
    
    //Load sky
    Spatial sky = SkyFactory.createSky(assetManager, "Textures/sky/skysphere.jpg", true);
    rootNode.attachChild(sky);
    

    Node world = new Node("world");
    world.attachChild(terrain); 
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
    camNode.setLocalTranslation(new Vector3f(0, 10, -60));
    //Rotate the camNode to look at the target:
    camNode.lookAt(humanStalker.getLocalTranslation(), Vector3f.UNIT_Y);
    //Attach the camNode to the target:
    humanStalker.attachChild(camNode);
    
    //chaseCam = new ChaseCamera(cam, human, inputManager);
    //chaseCam.setMaxDistance(8);
    //chaseCam.setMinDistance(2);
    
    
    bulletAppState.getPhysicsSpace().enableDebug(assetManager);
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
    public void setupTerrain(){
    //Load terrain
            
   /** 1. Create terrain material and load four textures into it. */
    Material mat_terrain = new Material(assetManager, 
            "Common/MatDefs/Terrain/Terrain.j3md");
 
    /** 1.1) Add ALPHA map (for red-blue-green coded splat textures) */
    mat_terrain.setTexture("Alpha", assetManager.loadTexture(
            "Textures/Terrain/splat/alphamap.png"));
 
    /** 1.2) Add GRASS texture into the red layer (Tex1). */
    Texture grass = assetManager.loadTexture(
            "Textures/Terrain/splat/grass.jpg");
    grass.setWrap(WrapMode.Repeat);
    mat_terrain.setTexture("Tex1", grass);
    mat_terrain.setFloat("Tex1Scale", 64f);
 
    /** 1.3) Add DIRT texture into the green layer (Tex2) */
    Texture dirt = assetManager.loadTexture(
            "Textures/Terrain/splat/dirt.jpg");
    dirt.setWrap(WrapMode.Repeat);
    mat_terrain.setTexture("Tex2", dirt);
    mat_terrain.setFloat("Tex2Scale", 32f);
 
    /** 1.4) Add ROAD texture into the blue layer (Tex3) */
    Texture rock = assetManager.loadTexture(
            "Textures/Terrain/splat/road.jpg");
    rock.setWrap(WrapMode.Repeat);
    mat_terrain.setTexture("Tex3", rock);
    mat_terrain.setFloat("Tex3Scale", 128f);
 
    /** 2. Create the height map */
    AbstractHeightMap heightmap = null;
    Texture heightMapImage = assetManager.loadTexture(
            "Textures/Terrain/splat/mountains512.png");
    heightmap = new ImageBasedHeightMap(heightMapImage.getImage(), 0.5f);
    heightmap.load();
 
    /** 3. We have prepared material and heightmap. 
     * Now we create the actual terrain:
     * 3.1) Create a TerrainQuad and name it "my terrain".
     * 3.2) A good value for terrain tiles is 64x64 -- so we supply 64+1=65.
     * 3.3) We prepared a heightmap of size 512x512 -- so we supply 512+1=513.
     * 3.4) As LOD step scale we supply Vector3f(1,1,1).
     * 3.5) We supply the prepared heightmap itself.
     */
    int patchSize = 65;
    terrain = new TerrainQuad("my terrain", patchSize, 513, heightmap.getHeightMap());
 
    /** 4. We give the terrain its material, position & scale it, and attach it. */
    terrain.setMaterial(mat_terrain);
    terrain.setLocalTranslation(0, 0, 0);
    terrain.setLocalScale(2f, 1f, 2f);
    // We set up collision detection for the scene by creating a
    // compound collision shape and a static RigidBodyControl with mass zero.
    //TerrainQuad tQ = (TerrainQuad) world.getChild(1);
    terrain.addControl(new RigidBodyControl(new HeightfieldCollisionShape(terrain.getHeightMap(), terrain.getLocalScale()),0));
    // Add terrain to phys. space.
    bulletAppState.getPhysicsSpace().addAll(terrain);
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
            enemyLoc.x+=Math.random()*100-50;
            enemyLoc.z+=Math.random()*10-5;
            enemyLoc.y = terrain.getHeight(new Vector2f(enemyLoc.x,enemyLoc.z))+10;         
            Node enemy = makeASinbad("Enemy"+i,enemyLoc,.5f,.01f);
            rootNode.attachChild(enemy);
            bulletAppState.getPhysicsSpace().add(enemy.getControl(CharacterControl.class));
            entities.put(new Long(i), enemy);
        }
    }
    public Node makeASinbad(String name,Vector3f pos,float scale,float speed){
    Node sinbadOut = new Node(name);
    Spatial sinbadModel = assetManager.loadModel("Models/Sinbad/Sinbad.mesh.j3o");
    sinbadModel.setName(name+"player");
    Spatial sword = assetManager.loadModel("Models/Sinbad/Sword/Sword.mesh.j3o");
    sword.setLocalTranslation(-1.1f, 0, 0);
    sword.rotate(new Quaternion().fromAngleAxis(FastMath.PI, Vector3f.UNIT_Y));
    sword.rotate(new Quaternion().fromAngleAxis(.3f, Vector3f.UNIT_X));
    sinbadOut.attachChild(sinbadModel);
    sinbadOut.attachChild(sword);

    sinbadOut.setLocalTranslation(pos);

    //Set up animation
    AnimControl control = sinbadModel.getControl(AnimControl.class);
    //control.addListener(this);

    // PlayerChannel later refered to by player.getControl(AnimControl.class).getChannel(0);
    AnimChannel playerChannel = control.createChannel();
    playerChannel.setAnim("IdleTop");
    playerChannel.setLoopMode(LoopMode.Loop);
    playerChannel.setSpeed(speed);    
    
    // CapWe also put the player in its starting position.
    CapsuleCollisionShape capsuleShape = new CapsuleCollisionShape(1.5f*scale, 6.5f*scale, 1);
    CharacterControl pControler = new CharacterControl(capsuleShape, .05f);
    pControler.setJumpSpeed(20);
    pControler.setFallSpeed(30);
    pControler.setGravity(30);
    //pControler.setPhysicsLocation(player.getWorldTranslation());//new Vector3f(0, 10, 0));
    pControler.setUseViewDirection(true);   
    
    // Add phys. controller to player.
//    sinbadModel.addControl(pControler);
    sinbadOut.addControl(pControler);
    sinbadOut.scale(scale);
    return sinbadOut;
    }
    
    public void setupSidePlanes(){
    Vector3f displacement = new Vector3f(0,0,-20);
    Vector3f normal = new Vector3f(0,0,1);
    float constant = displacement.dot(normal);
    Plane plane = new Plane(normal, constant);
    PlaneCollisionShape zMinusColl = new PlaneCollisionShape(plane);
    
    displacement = new Vector3f(0,0,20);
    normal = new Vector3f(0,0,-1);
    constant = displacement.dot(normal);
    Plane plane2 = new Plane(normal, constant);
    PlaneCollisionShape zPlussColl = new PlaneCollisionShape(plane2);    
  
    RigidBodyControl zMinusCollContr = new RigidBodyControl(zMinusColl,0);
    RigidBodyControl zPlussCollContr = new RigidBodyControl(zPlussColl,0);

    bulletAppState.getPhysicsSpace().add(zMinusCollContr);
    bulletAppState.getPhysicsSpace().add(zPlussCollContr);
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
         * if (animName.equals("RunTop")) {
      chan.setAnim("IdleTop", 0.50f);
      chan.setLoopMode(LoopMode.DontLoop);
      chan.setSpeed(1f);
    }
         * 
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
          player.getControl(AnimControl.class).getChannel(0).setAnim("RunTop", 0.50f); // TODO: Must activate "RunBase" after a certain time.
          player.getControl(AnimControl.class).getChannel(0).setAnim("RunBase", 0.50f); // TODO: Must be activated after a certain time after "RunTop"
          player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.Loop);
          }
      }
      else if (pressed==0&!value&!binding.equals("Jump")) {
          walk = false;
          if(!jump){
          logger.log(Level.INFO,"Character walking end.");
          //playerChannel.setAnim("IdleTop", 0.50f);
          player.getControl(AnimControl.class).getChannel(0).setAnim("IdleTop", 0.50f);          
          player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);          
          }
      }
    if (binding.equals("Jump") &! jump ) {
        if (value){
        logger.log(Level.INFO,"Character jumping start.");
        jump = true;
        // channel.setAnim("JumpStart", 0.5f); // TODO: Must activate "JumpLoop" after a certain time.
        human.getControl(CharacterControl.class).jump();
        player.getControl(AnimControl.class).getChannel(0).setAnim("JumpLoop", 0.50f); // TODO: Must be activated after a certain time after "JumpStart"
        player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.Loop);
        }
    }

    }

    float hasJumped = 0;

    @Override
    public void simpleUpdate(float tpf) {
        
        for(Node a:entities.values()){
            Vector3f humanPos = human.getLocalTranslation().clone();
            Quaternion newRot = new Quaternion().fromAngleAxis(FastMath.rand.nextFloat()*2-.5f, Vector3f.UNIT_Y);
            humanPos.y = a.getLocalTranslation().y;            
            a.lookAt(humanPos,Vector3f.UNIT_Y);
            a.getLocalRotation().slerp(newRot,tpf);            
            
            float distSquared = humanPos.distanceSquared(a.getLocalTranslation());
            if(distSquared>9){      
            a.getControl(CharacterControl.class).setViewDirection(a.getLocalRotation().mult(Vector3f.UNIT_Z));            
            a.getControl(CharacterControl.class).setWalkDirection(a.getLocalRotation().mult(Vector3f.UNIT_Z).mult(tpf*5));
                if(!a.getChild(0).getControl(AnimControl.class).getChannel(0).getAnimationName().equals("RunBase")&&!a.getChild(0).getControl(AnimControl.class).getChannel(0).getAnimationName().equals("RunTop"))
                {
                a.getChild(0).getControl(AnimControl.class).getChannel(0).setAnim("RunTop", 0.50f); // TODO: Must activate "RunBase" after a certain time.                    
                a.getChild(0).getControl(AnimControl.class).getChannel(0).setAnim("RunBase", 0.50f);
                a.getChild(0).getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.Loop);
                }
                // Workaround
                if(a.getChild(0).getControl(AnimControl.class).getChannel(0).getSpeed()!=smallManSpeed){
                a.getChild(0).getControl(AnimControl.class).getChannel(0).setSpeed(smallManSpeed);
                }            
            }
            else{
            a.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
                if(!a.getChild(0).getControl(AnimControl.class).getChannel(0).getAnimationName().equals("IdleTop"))
                {
                a.getChild(0).getControl(AnimControl.class).getChannel(0).setAnim("IdleTop", 0.50f);
                a.getChild(0).getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);
                }
            }
            
        
        }
        
        Vector3f pos = human.getControl(CharacterControl.class).getPhysicsLocation();
        humanStalker.setLocalTranslation(pos);
        
        //chaseCam.update(tpf);
        
        Vector2f pos2d = new Vector2f(pos.x,pos.z);
        float height = terrain.getHeight(pos2d);
        if(height>pos.y-6){
            if(jump)
            {
            hasJumped+=tpf;
                if(hasJumped>0.2f)
                {
                logger.log(Level.INFO,"Character jumping end.");
                jump = false;
                hasJumped = 0;
                    if(walk){
                    //channel.setAnim("RunTop", 0.50f);
                    player.getControl(AnimControl.class).getChannel(0).setAnim("RunBase", 0.10f);
                    player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.Loop);
                    }
                    else{
                    player.getControl(AnimControl.class).getChannel(0).setAnim("IdleTop", 0.10f);
                    player.getControl(AnimControl.class).getChannel(0).setLoopMode(LoopMode.DontLoop);                           
                    human.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
                    }
                                             
                }
            }
        }
    }

    @Override
    public void simpleRender(RenderManager rm) {
        //TODO: add render code
    }

    public void onAnalog(String binding, float value, float tpf) {
        if(!jump)
        {
        if (binding.equals("Left")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.leftDir, tpf*3);
        human.setLocalRotation(newRot);
        }
        else if (binding.equals("Right")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.rightDir, tpf*3);
        human.setLocalRotation(newRot);        
        } else if (binding.equals("Up")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.upDir, tpf*3);
        human.setLocalRotation(newRot);
        } else if (binding.equals("Down")) {
        Quaternion newRot = new Quaternion().slerp(human.getLocalRotation(),Directions.downDir, tpf*3);
        human.setLocalRotation(newRot);
        }
        
        if(walk){
        human.getControl(CharacterControl.class).setViewDirection(human.getWorldRotation().mult(Vector3f.UNIT_Z));                     
        human.getControl(CharacterControl.class).setWalkDirection(human.getControl(CharacterControl.class).getViewDirection().multLocal(tpf*20));                  
        }        
        else{
        human.getControl(CharacterControl.class).setWalkDirection(Vector3f.ZERO);
        }
        }
    }
}