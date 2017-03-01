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
package com.bigboots.states;

import com.bigboots.BBGlobals;
import com.bigboots.BBWorldManager;
import com.bigboots.audio.BBAudioManager;
import com.bigboots.components.camera.BBCameraComponent;
import com.bigboots.components.camera.BBCameraManager;
import com.bigboots.components.camera.BBSideModeCamera;
import com.bigboots.components.BBAudioComponent;
import com.bigboots.components.BBMonsterManager;
import com.bigboots.components.BBNodeComponent;
import com.bigboots.components.BBPlayerManager;
import com.bigboots.components.camera.BBFirstPersonCamera;
import com.bigboots.components.camera.BBThirdPersonCamera;
import com.bigboots.components.emitters.BBParticlesManager;
import com.bigboots.core.BBDebugInfo;
import com.bigboots.core.BBEngineSystem;
import com.bigboots.core.BBSceneManager;
import com.bigboots.core.BBSettings;
import com.bigboots.gui.BBGuiManager;
import com.bigboots.gui.BBTextProgressController;
import com.bigboots.input.BBInputManager;
import com.bigboots.input.BBPlayerActions;
import com.bigboots.physics.BBBasicCollisionListener;
import com.bigboots.physics.BBPhysicsManager;
import com.bigboots.scene.BBSceneComposer;
import com.bigboots.scene.BBShaderManager;

import com.jme3.animation.AnimChannel;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.renderer.ViewPort;

//for player
import com.jme3.animation.AnimControl;
import com.jme3.animation.AnimEventListener;
import com.jme3.asset.DesktopAssetManager;
import com.jme3.scene.Node;
import com.jme3.asset.ModelKey;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.input.KeyInput;
import com.jme3.input.MouseInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.AnalogListener;
import com.jme3.input.controls.KeyTrigger;
import com.jme3.input.controls.MouseAxisTrigger;
import com.jme3.input.controls.MouseButtonTrigger;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.util.BufferUtils;
import de.lessvoid.nifty.screen.Screen;


/**
 *
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBInGameState extends BBAbstractState{
    
    private float mTime = 0;
    private BBNodeComponent humanStalker;
    private BBTextProgressController mLoadCtrl;
    private Camera cam;
    //music
    private BBAudioComponent music;   
    private GameActionListener actionListener;
    private BBPlayerActions playerListener = new BBPlayerActions();

    public BBInGameState() {
        
    }
    
    @Override
    public void initialize(BBEngineSystem eng) {       
        super.initialize(eng);
        //BBGuiManager.getInstance().getNifty().gotoScreen("progress");
        
        BBGuiManager.getInstance().getNifty().gotoScreen("loadgame");
        //BBGuiManager.getInstance().enableProgressBar(true);
        Screen mScreen = BBGuiManager.getInstance().getNifty().getScreen("loadgame");
        mLoadCtrl = mScreen.findControl("text_progress", BBTextProgressController.class);    
        mLoadCtrl.setProgressLoading("Loading Game ...");
        
        mLoadCtrl.setProgressLoading("Initializing Engine systems ...");

        //Init the physic manager before create collision shape
        BBPhysicsManager.getInstance().init(engineSystem);  
        
        //Init world manager
        BBWorldManager.getInstance().init();
        
        //Init particles manager
        BBParticlesManager.getInstance().init();
 /*       
        BBSceneManager.getInstance().createFilterProcessor();
        
        //Create post effect processor
        BBSceneManager.getInstance().createFilter("GAME_BLOOM", BBSceneManager.FilterType.BLOOM);
        BloomFilter tmpFilter = (BloomFilter) BBSceneManager.getInstance().getFilterbyName("GAME_BLOOM");
        tmpFilter.setBloomIntensity(2.0f);
        tmpFilter.setExposurePower(1.3f);
         
        BBSceneManager.getInstance().createFilter("GAME_BLEUR", BBSceneManager.FilterType.DEPHT);
        DepthOfFieldFilter tmpFltrBleur= (DepthOfFieldFilter) BBSceneManager.getInstance().getFilterbyName("GAME_BLEUR");
        tmpFltrBleur.setFocusDistance(0);
        tmpFltrBleur.setFocusRange(150);
        tmpFltrBleur.setBlurScale(1.4f);
        
        //Create sun
        BBSceneManager.getInstance().createFilter("GAME_LIGHT", BBSceneManager.FilterType.LIGHT);
        LightScatteringFilter tmpFltrLight = (LightScatteringFilter) BBSceneManager.getInstance().getFilterbyName("GAME_LIGHT");
        Vector3f lightDir = new Vector3f(35.12f, -0.3729129f, 3.74847335f);
        Vector3f lightPos = lightDir.multLocal(-5000);
        tmpFltrLight.setLightPosition(lightPos);
     
        BBSceneManager.getInstance().createFilter("GAME_TOON", BBSceneManager.FilterType.CARTOON);
 */  
    }
    
    @Override
    public void stateDetached() {
        super.stateDetached();
        
        //reset input
        BBInputManager.getInstance().getInputManager().removeListener(actionListener);
        BBInputManager.getInstance().getInputManager().removeListener(playerListener);
        
        music.destroy();
        music = null;
        
        BBPlayerManager.getInstance().destroy();
    
        humanStalker.detachAllChildren();
        humanStalker.removeFromParent();
        humanStalker.getWorldLightList().clear();
        humanStalker.getLocalLightList().clear();
        humanStalker = null;

        BBAudioManager.getInstance().destroy();
        BBPhysicsManager.getInstance().destroy();
        
        BBSceneManager.getInstance().destroy();
        
        this.engineSystem.getRenderManager().clearQueue(BBSceneManager.getInstance().getViewPort());        
        this.engineSystem.getRenderManager().removeMainView("TEST"); 
        
    }
    
    private boolean loadCam = true;
    private boolean loadInput, loadScene, loadCharac, loadEnemy = false;
    private boolean mInitGame, runGame = false;
    
    @Override
    public void update(float tpf) {
        super.update(tpf);    
        
        mTime += tpf;
        //System.out.println("***** TIme : "+mTime);
        
        //Wait few times before continue loading game to let Nifty to display contents
        if(true == loadCam && mTime > 1.5f){
            this.loadCamera();
            loadCam = false;
            loadScene = true;
            mTime =0;
        }
        if(true == loadScene && mTime > 2.2f){
            this.loadScene();
            loadScene = false;
            loadCharac = true;
            mTime =0;
        }
        
        if(true == loadCharac && mTime > 2.0f){
            this.loadCharact();
            loadCharac = false;
            loadEnemy = true;
            mTime = 0;
        }
        if(true == loadEnemy && mTime > 2.2f){
            this.loadEnemies();
            loadEnemy = false;
            loadInput = true;
            mTime =0;
        }

        if(true == loadInput && mTime > 2.5f){
            this.loadInputs();
            loadInput = false;
            mInitGame = true;
        }
        
        if(true == mInitGame && mTime > 2.9f){
            this.finishLoading();
            mInitGame = false;
            runGame = true;
            mTime =0;
        }
        
         if(false == runGame){
             return;
         }
        //******************************************************
        // Update character
        Vector3f pos = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class).getControl(CharacterControl.class).getPhysicsLocation();
        humanStalker.setLocalTranslation(pos);
        
        BBPlayerManager.getInstance().update(tpf);
        
        BBCameraManager.getInstance().update();
        
        BBMonsterManager.getInstance().update(tpf);
 
    }

    private class GameActionListener implements AnimEventListener, ActionListener, AnalogListener {
        private BBEngineSystem engineSystem;
        public GameActionListener(BBEngineSystem eng){
             engineSystem = eng;
        }
        
        public void onAction(String binding, boolean keyPressed, float tpf) {
            
            if (binding.equals(BBGlobals.INPUT_MAPPING_EXIT) && !keyPressed) {
              BBInputManager.getInstance().getInputManager().setCursorVisible(true);  
              BBGuiManager.getInstance().getNifty().gotoScreen("game");
              //TODO : pause the game by disabling render and actions update. Let the input enabled
              //this.engineSystem.setSystemPause(!this.engineSystem.isSystemPause());
              return;
            }
            else if (binding.equals(BBGlobals.INPUT_MAPPING_DEBUG) && !keyPressed) { 
                
              BBPhysicsManager.getInstance().setDebugInfo(!BBPhysicsManager.getInstance().isShowDebug());
              BBDebugInfo.getInstance().setDisplayFps(!BBDebugInfo.getInstance().isShowFPS());
              BBDebugInfo.getInstance().setDisplayStatView(!BBDebugInfo.getInstance().isShowStat());
            }
            else if (binding.equals(BBGlobals.INPUT_MAPPING_CAMERA_POS) && !keyPressed) {
                    Vector3f loc = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class).getControl(CharacterControl.class).getPhysicsLocation();
                    Quaternion rot = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class).getLocalRotation();
                    System.out.println("***** Character Position: ("
                            + loc.x + ", " + loc.y + ", " + loc.z + ")");
                    System.out.println("***** Character Rotation: " + rot);
                    System.out.println("***** Character Direction: " + BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class).getControl(CharacterControl.class).getViewDirection());
            } else if (binding.equals(BBGlobals.INPUT_MAPPING_MEMORY) && !keyPressed) {
                BufferUtils.printCurrentDirectMemory(null);
            }
        }//end onAAction
        
              
        public void onAnalog(String binding, float value, float tpf) {
            
            BBCameraComponent tmpCam = BBCameraManager.getInstance().getCurrentCamera();
            
            if (tmpCam.getCamMode().equals(BBCameraComponent.CamMode.FPS)){
                BBFirstPersonCamera tmpFPS = (BBFirstPersonCamera)tmpCam;
                if (binding.equals("MOUSE_LEFT")){
                    tmpFPS.rotateCamera(value, tmpFPS.getUpVector());
                }else if (binding.equals("MOUSE_RIGHT")){
                    tmpFPS.rotateCamera(-value, tmpFPS.getUpVector());
                }else if (binding.equals("MOUSE_UP")){
                    tmpFPS.rotateCamera(-value, tmpFPS.getEngineCamera().getLeft());
                }else if (binding.equals("MOUSE_DOWN")){
                    tmpFPS.rotateCamera(value, tmpFPS.getEngineCamera().getLeft());
                } 
            }else{
                return;
            }

            
        }//end onAnalog
        
        // Abstract funtion coming with animation
        public void onAnimCycleDone(AnimControl control, AnimChannel chan, String animName) {
            //unused
        }
        // Abstract funtion coming with animation
        public void onAnimChange(AnimControl control, AnimChannel channel, String animName) {
            // unused
        }
    }//end GameActionListener

    //========================================================================
    
    private void loadCamera(){
        
        mLoadCtrl.setProgressLoading("Creating Camera system ...");
 
        //instanciate the actions to listen to for the main class state screen
        actionListener = new GameActionListener(engineSystem);
        
        //Load first scene and camera
        cam = new Camera(BBSettings.getInstance().getSettings().getWidth(), BBSettings.getInstance().getSettings().getHeight());
        cam.setFrustumPerspective(45f, (float)cam.getWidth() / cam.getHeight(), 1f, 1000f);
        cam.setLocation(new Vector3f(25f, 10f, 0f));
        cam.lookAt(new Vector3f(0f, 0f, 0f), Vector3f.UNIT_Y);
              
        ViewPort vp = engineSystem.getRenderManager().createMainView("TEST", cam);
        vp.setClearFlags(true, true, true);
        BBSceneManager.getInstance().setViewPort(vp);
        
        mLoadCtrl.setProgressLoading("Loading music ...");

        //init global music
        music = new BBAudioComponent("Sounds/battle.ogg", false);
        //music = new BBAudioComponent("Sounds/ingame.ogg", false);
        music.setVolume(0.1f);
        music.setLooping(true);
        music.play();
        
        mLoadCtrl.setProgressLoading("Loading world ...");
    }
    
    private void loadEnemies(){
        mLoadCtrl.setProgressLoading("Creating monsters ...");

        //*******************************************
        //Create enemies

        // This node is needed for sword killing by the player
        Node enemyNode = new Node("enemyNode");
        BBSceneManager.getInstance().getRootNode().attachChild(enemyNode);
        
        for (int i=0; i<30; i++){
         Vector3f mPos = new Vector3f(100 + i*13, 100, 0f);  
         BBMonsterManager.getInstance().createMonter("ENEMY" + i, "Scenes/TestScene/mutant.j3o", mPos, new Vector3f(0,-1.0f, 0), 1+FastMath.nextRandomFloat()*2);
         enemyNode.attachChild(BBMonsterManager.getInstance().getMonster("ENEMY" + i).getComponent(BBNodeComponent.class));
        }
        
        
    }
    
    private void loadInputs(){        
        mLoadCtrl.setProgressLoading("Initializing game inputs ...");
        //Set up keys
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_CAMERA_POS, new KeyTrigger(KeyInput.KEY_F2));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_MEMORY, new KeyTrigger(KeyInput.KEY_F3));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_HIDE_STATS, new KeyTrigger(KeyInput.KEY_F4));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_LEFT, new KeyTrigger(KeyInput.KEY_J));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_RIGHT, new KeyTrigger(KeyInput.KEY_L));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_UP, new KeyTrigger(KeyInput.KEY_I));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_DOWN, new KeyTrigger(KeyInput.KEY_K));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_JUMP, new KeyTrigger(KeyInput.KEY_SPACE));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_EXIT, new KeyTrigger(KeyInput.KEY_ESCAPE));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_DEBUG, new KeyTrigger(KeyInput.KEY_F1));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_MLEFT, new MouseButtonTrigger(MouseInput.BUTTON_LEFT));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_MRIGHT, new MouseButtonTrigger(MouseInput.BUTTON_RIGHT));
        
        BBInputManager.getInstance().mapKey("MOUSE_LEFT", new MouseAxisTrigger(MouseInput.AXIS_X, true));
        BBInputManager.getInstance().mapKey("MOUSE_RIGHT", new MouseAxisTrigger(MouseInput.AXIS_X, false));
        BBInputManager.getInstance().mapKey("MOUSE_UP", new MouseAxisTrigger(MouseInput.AXIS_Y, false));
        BBInputManager.getInstance().mapKey("MOUSE_DOWN", new MouseAxisTrigger(MouseInput.AXIS_Y, true));
        
        BBInputManager.getInstance().getInputManager().addListener(actionListener,
                "MOUSE_LEFT","MOUSE_RIGHT","MOUSE_UP","MOUSE_DOWN",
                                                                    BBGlobals.INPUT_MAPPING_EXIT, 
                                                                    BBGlobals.INPUT_MAPPING_DEBUG,
                                                                    BBGlobals.INPUT_MAPPING_CAMERA_POS,
                                                                    BBGlobals.INPUT_MAPPING_MEMORY);
        BBInputManager.getInstance().getInputManager().addListener(playerListener,
                                                                    BBGlobals.INPUT_MAPPING_MLEFT,
                                                                    BBGlobals.INPUT_MAPPING_MRIGHT,
                                                                    BBGlobals.INPUT_MAPPING_LEFT,
                                                                    BBGlobals.INPUT_MAPPING_RIGHT, 
                                                                    BBGlobals.INPUT_MAPPING_UP, 
                                                                    BBGlobals.INPUT_MAPPING_DOWN,
                                                                    BBGlobals.INPUT_MAPPING_JUMP);
        
        BBInputManager.getInstance().setMouseCenter();
        BBInputManager.getInstance().getInputManager().setCursorVisible(false);
        mLoadCtrl.setProgressLoading("Creating main user interface ...");
        mLoadCtrl.setProgressLoading("Loading complete ...");
    }
    
    private void loadCharact(){
        
        //*******************************************
        //Create the main Character
        BBPlayerManager.getInstance().createMainPlayer("PLAYER_NAME", "Scenes/TestScene/character.mesh.xml", new Vector3f(0,-0.85f, 0), 1.0f);
                
        // Create a component Node for camera 
        humanStalker = new BBNodeComponent("HumanStalker");
        BBSceneManager.getInstance().addChild(humanStalker);
        
        BBCameraManager.getInstance().registerCamera("SIDE_CAM", BBCameraComponent.CamMode.SIDE, cam, true);
        //BBCameraManager.getInstance().registerCamera("RPG_CAM", BBCameraComponent.CamMode.ORBITAL, cam, true);
        //BBCameraManager.getInstance().registerCamera("FPS_CAM", BBCameraComponent.CamMode.FPS, cam, true);
        BBCameraComponent camera = BBCameraManager.getInstance().getCurrentCamera();
        
        if(camera.getCamMode().equals(BBCameraComponent.CamMode.SIDE)){
            BBSideModeCamera sideCam = (BBSideModeCamera)camera;
            sideCam.initCamera();
            sideCam.setPosition(new Vector3f(0, 4, 17));
            sideCam.setTarget(humanStalker);
        }else if(camera.getCamMode().equals(BBCameraComponent.CamMode.FPS)){
            BBFirstPersonCamera fpsCam = (BBFirstPersonCamera)camera;
            fpsCam.setTarget(BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class));
        }else if(camera.getCamMode().equals(BBCameraComponent.CamMode.ORBITAL)){
            BBThirdPersonCamera orbCam = (BBThirdPersonCamera)camera;
            orbCam.initCamera();
            orbCam.setTarget(humanStalker);
        }  
        
        mLoadCtrl.setProgressLoading("Creating monsters ...");
    }
    private void finishLoading(){
        mLoadCtrl.printDebug();
        
        //Display the HUD screen for this state
        //TODO : here the screen need to be created before player
        //because we init the life bar in BBPlayerMgr
        BBGuiManager.getInstance().getNifty().gotoScreen("hud");
    }
     
    private void loadScene(){       
        // Load a blender file Scene. 
        DesktopAssetManager dsk = (DesktopAssetManager) BBSceneManager.getInstance().getAssetManager();        
        ModelKey bk = new ModelKey("J3O/Scenes/level_01.j3o");
        Node nd =  (Node) dsk.loadModel(bk);                 
        
        // Creating Entities from the Blend Scene
        BBSceneComposer sc = new BBSceneComposer(nd, BBSceneManager.getInstance().getAssetManager());

        //Clear Blend File
        nd.detachAllChildren();
        nd.removeFromParent();
        nd = null;
        dsk.clearCache();        
        
        // Added scene effects (fog, ibl)
        BBShaderManager shm = new BBShaderManager(BBSceneManager.getInstance().getRootNode(), BBSceneManager.getInstance().getAssetManager());
        shm.setSimpleIBLParam("Textures/skyboxes/sky_box_01/skybox_01_low.png");   
        shm.setFogParam(new ColorRGBA(0.7f,0.6f,0.2f, 43f), null);
        
        mLoadCtrl.setProgressLoading("Setting environment ...");
        
        //********************************************
        //Set collision listener
        BBBasicCollisionListener basicCol = new BBBasicCollisionListener();
        BBPhysicsManager.getInstance().getPhysicsSpace().addCollisionListener(basicCol);
        
        // Load the main map (here blend loading)
        BBSceneManager.getInstance().setupBasicLight();
        BBSceneManager.getInstance().createSky();
//        BBSceneManager.getInstance().setUpBasicShadow();  
              
        mLoadCtrl.setProgressLoading("Loading main player avatar ...");
    }

}
