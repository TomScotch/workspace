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
package com.bigboots.components;

import com.bigboots.BBGlobals;
import com.bigboots.BBWorldManager;
import com.bigboots.animation.BBAnimManager;
import com.bigboots.audio.BBAudioManager;
import com.bigboots.components.BBCollisionComponent.ShapeType;
import com.bigboots.components.BBComponent.CompType;
import com.bigboots.core.BBSceneManager;
import com.bigboots.gui.BBGuiManager;
import com.bigboots.gui.BBProgressbarController;
import com.bigboots.physics.BBPhysicsManager;
import com.jme3.animation.AnimChannel;
import com.jme3.animation.Bone;
import com.jme3.animation.LoopMode;
import com.jme3.animation.SkeletonControl;
import com.jme3.bounding.BoundingBox;
import com.jme3.bounding.BoundingVolume;
import com.jme3.bullet.collision.shapes.CollisionShape;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.collision.CollisionResults;
import com.jme3.material.Material;
import com.jme3.material.RenderState.BlendMode;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import com.jme3.renderer.queue.RenderQueue.Bucket;
import com.jme3.renderer.queue.RenderQueue.ShadowMode;
import com.jme3.scene.Geometry;
import com.jme3.scene.Mesh;
import com.jme3.scene.Node;
import com.jme3.scene.shape.Box;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBPlayerManager {
    private static BBPlayerManager instance = new BBPlayerManager();

    private BBPlayerManager() {
        
    }
    
    public static BBPlayerManager getInstance() { 
        return instance; 
    }
    
    private BBEntity mMainPlayer;
    private Vector3f mMainLocation = new Vector3f(-5, 20, -5);
    
    private boolean mIsWalking = false;
    private boolean mIsJumping = false;
    private BBGlobals.ActionType mAction = BBGlobals.ActionType.IDLE;
    
    private float hasJumped = 0;
    private boolean hasBeenOnGround = false;
    private static final Logger logger = Logger.getLogger(BBPlayerManager.class.getName());
    private Geometry swordCollision;
    private SkeletonControl skeletonControl;
    private ArrayList<Bone> bn;
    
    // Sword
    private float swordTime = 0;
    private boolean swordStrike = false;
    private BoundingVolume  bv;
    private boolean strike = false;    
    
    
    public void createMainPlayer(String name, String file, Vector3f posOffset, float scalePlayer){
        //Create the main Character       
        mMainPlayer = new BBEntity("PLAYER");
        mMainPlayer.setObjectTag(BBObject.ObjectTag.PLAYER);
        BBNodeComponent pnode = mMainPlayer.addComponent(CompType.NODE);
         pnode.scale(scalePlayer);
        pnode.setLocalTranslation(this.getMainLocation());
        mMainPlayer.attachToRoot();
        mMainPlayer.loadModel("Scenes/TestScene/character.mesh.xml");

        
        
        // Additional collision mesh for sword and bullets
        BoundingBox bv = (BoundingBox) pnode.getWorldBound();
        Mesh meshCollision = new Box( bv.getXExtent()*0.5f, bv.getYExtent()*0.8f, bv.getZExtent()*0.6f);
        Geometry geoCollision = new Geometry("additiveCollision", meshCollision);
        
        Material matPlayerCollision = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        matPlayerCollision.setColor("Color", new ColorRGBA(0.8f, 0.8f, 0.05f, 0.1f));
        matPlayerCollision.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);        
        matPlayerCollision.setReceivesShadows(false);
        geoCollision.setShadowMode(ShadowMode.Off);
        geoCollision.setQueueBucket(Bucket.Transparent);  
        matPlayerCollision.getAdditionalRenderState().setWireframe(true);
        geoCollision.setMaterial(matPlayerCollision);
        
        Node childToAttach = (Node) pnode.getChild(0);
        geoCollision.setLocalTranslation(posOffset.negate());
        geoCollision.setUserData("entityName", name);
        mMainPlayer.setChildMesh(geoCollision);
        childToAttach.attachChild(geoCollision);          
        
        
        
        pnode.getChild(0).setLocalTranslation(posOffset);
        //BBSceneManager.getInstance().addChild(pnode);
                
        BBAnimComponent panim = mMainPlayer.addComponent(CompType.ANIMATION);
        panim.getChannel().setAnim("base_stand");
        panim.getChannel().setSpeed(1f); 
        panim.getChannel().setLoopMode(LoopMode.Cycle);
        
        CollisionShape pShape = BBPhysicsManager.getInstance().createPhysicShape(ShapeType.CAPSULE, mMainPlayer.getComponent(BBNodeComponent.class), 0.6f, 1.0f);
        pShape.setMargin(0.1f);
        //CollisionShape pShape = BBPhysicsManager.getInstance().createPhysicShape(ShapeType.MESH, mMainPlayer);
        BBCollisionComponent pColCp = mMainPlayer.addComponent(CompType.COLSHAPE);
        pColCp.attachShape(pShape);
        
        CharacterControl pControler = (CharacterControl) BBAnimManager.getInstance().createControl(BBControlComponent.ControlType.CHARACTER, mMainPlayer); 
        pControler.setJumpSpeed(20);
        pControler.setFallSpeed(40);
        pControler.setGravity(40);
        pControler.setMaxSlope(10.5f);
        pControler.setPhysicsLocation(pnode.getWorldTranslation().add(posOffset));
        pControler.setUseViewDirection(true);
        BBControlComponent pCtrl = mMainPlayer.addComponent(CompType.CONTROLLER);
        pCtrl.setControlType(BBControlComponent.ControlType.CHARACTER);
        pCtrl.attachControl(pControler);
        mMainPlayer.getComponent(BBNodeComponent.class).addControl(pControler);
        BBPhysicsManager.getInstance().getPhysicsSpace().add(mMainPlayer.getComponent(BBNodeComponent.class));
        
        //Define the listener
        BBListenerComponent lst = mMainPlayer.addComponent(CompType.LISTENER);
        lst.setLocation(mMainPlayer.getComponent(BBNodeComponent.class).getWorldTranslation());
        BBAudioManager.getInstance().getAudioRenderer().setListener(lst);
        //Create associated audio
        BBAudioComponent stepSound = new BBAudioComponent();
        stepSound.setSoundName("Sounds/step1.ogg", false);
        stepSound.setLooping(false);
        stepSound.setVolume(0.1f);
        mMainPlayer.addAudio("STEP", stepSound);
        
        BBAudioComponent fireSound = new BBAudioComponent();
        fireSound.setSoundName("Sounds/explosionSmall.ogg", false);
        fireSound.setLooping(false);
        fireSound.setVolume(0.03f);
        mMainPlayer.addAudio("FIRE", fireSound);
        
        BBWorldManager.getInstance().addEntity(mMainPlayer);
        //Get life bar
        int health = (Integer) mMainPlayer.getSkills("HEALTH");
        //BBGuiManager.getInstance().getNifty().getScreen("hud").findControl("player_progress", com.bigboots.gui.BBProgressbarController.class).setProgress(health / 100.0f);

        
        // Create a bix mesh for SWORD FIGHTING
        Box a = new Box(Vector3f.ZERO, 0.5f, 0.7f, 0.5f);
        swordCollision = new Geometry("Box", a);
//        swordCollision.setLocalTranslation(0, -1, 0);
        swordCollision.updateModelBound();
                
        Material mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        mat.setColor("Color", new ColorRGBA(0.1f, 0.1f, 0.9f, 0.3f));
        mat.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);                
        mat.setReceivesShadows(false);
        swordCollision.setMaterial(mat);
        swordCollision.setShadowMode(ShadowMode.Off);
        swordCollision.setQueueBucket(Bucket.Transparent);          
        mat.getAdditionalRenderState().setWireframe(true);
        
        BBSceneManager.getInstance().getRootNode().attachChild(swordCollision);
        skeletonControl = mMainPlayer.getComponent(BBNodeComponent.class).getChild(0).getControl(SkeletonControl.class);

        swordCollision.setLocalRotation(skeletonControl.getSkeleton().getBone("sword").getModelSpaceRotation());        
        Node sworD = skeletonControl.getAttachmentsNode("sword");
        sworD.attachChild(swordCollision);         
    }
    
    public void update(float tpf){
       CharacterControl pCharCtrl = mMainPlayer.getComponent(BBNodeComponent.class).getControl(CharacterControl.class);
       AnimChannel pChannel = mMainPlayer.getComponent(BBAnimComponent.class).getChannel();
      
        if(pCharCtrl.onGround()){
            if(mIsJumping)
            {
                boolean hasBeenOnGroundCopy = hasBeenOnGround;
                if(!hasBeenOnGround){
                    hasBeenOnGround=true;
                }   
         
                if(hasBeenOnGroundCopy)
                {
//                    hasJumped+=tpf;
//
//                    logger.log(Level.INFO,"Character jumping end.");
                    mIsJumping = false;
//                    hasJumped = 0;
                    if(mIsWalking){
//                        
                        logger.log(Level.INFO,"Character jumping end. Start stand.");
//
                        pChannel.setAnim("run_01", 0.10f);
                        pChannel.setLoopMode(LoopMode.Loop);
                    }
                    else{
                        logger.log(Level.INFO,"Character jumping end. Start stand.");
//
                        pChannel.setAnim("base_stand", 0.10f);
                        pChannel.setLoopMode(LoopMode.DontLoop);                           
                        pCharCtrl.setWalkDirection(Vector3f.ZERO);
                    }
                    hasBeenOnGround = false;
                     }
                  }
            
                
            if(mIsWalking && !mIsJumping){
//            pCharCtrl.setWalkDirection(mMainPlayer.getComponent(pCharCtrl.getViewDirection().mult(.2f));                  
             }        
             else{
             pCharCtrl.setWalkDirection(Vector3f.ZERO);
           }            
        }

        else if(!mIsJumping){
          //  logger.log(Level.INFO,"Character jumping start.");
          //  mIsJumping = true;
       //     pChannel.setAnim("jump", 0.50f); // TODO: Must be activated after a certain time after "JumpStart"
       //     pChannel.setLoopMode(LoopMode.DontLoop);
        }
        
        
        // STRIKE WITH THE SWORD
        if (swordStrike == true) {
        swordTime += tpf;
//        System.out.println(swordTime);
        

        if(strike == false  && swordTime > 0.2f && swordTime <= 0.4f) {
        // Collision listener
        bv = swordCollision.getWorldBound();
        CollisionResults results = new CollisionResults();
        BBSceneManager.getInstance().getRootNode().getChild("enemyNode").collideWith(bv, results);
        
        
        if (results.size() > 0) {

        Geometry closest = results.getClosestCollision().getGeometry();

        if(closest != null && closest.getUserData("entityName") != null) {

            String entity = closest.getUserData("entityName");
            BBEntity monster = BBMonsterManager.getInstance().getMonster(entity);
            
            
            
            if (monster != null && entity.equals(BBPlayerManager.getInstance().getMainPlayer().getObjectName()) == false
                && entity.indexOf("DEAD_") != 0 ) {
                
                
                int health = (Integer) monster.getSkills("HEALTH");
                health = health - 50;
                monster.setSkills("HEALTH", health);
                BBGuiManager.getInstance().getNifty().getScreen("hud").findControl("enemy_progress", BBProgressbarController.class).setProgress(health / 100.0f);                
//                System.out.println(entity+" -- SWORD KILLING");
                strike = true;
               }
              }
             }
           } else if (swordTime > 0.4f) {
                swordTime = 0;
                strike = false;
                swordStrike = false;
        }
       }
        
        
      }
    
    
    
    
    
    public void setAction(BBGlobals.ActionType act){
        mAction = act;
    }

    public BBGlobals.ActionType getAction(){
        return mAction;
    }
    
    public void setIsWalking(boolean val){
        mIsWalking = val;
    }

    public void setIsJumping(boolean val){
        mIsJumping = val;
    }
    
    public boolean isWalking(){
        return mIsWalking;
    }

    public boolean isJumping(){
        return mIsJumping;
    }
    
    public BBEntity getMainPlayer(){
        return mMainPlayer;
    }
    
    public Vector3f getMainLocation(){
        return mMainLocation;
    }
    
    public void destroy(){
        BBWorldManager.getInstance().removeEntity(mMainPlayer.getObjectName());
        mMainPlayer.destroy();
    }

    
    // check for Sword Strike
    public void setSwordStrike(boolean val){
        swordStrike = val;
    }

    public boolean getSwordStrike(){
        return swordStrike;
    }
    
    
}
