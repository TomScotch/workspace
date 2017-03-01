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

import com.bigboots.animation.BBAnimManager;
import com.bigboots.components.BBAnimComponent;
import com.bigboots.components.BBCollisionComponent;
import com.bigboots.components.BBCollisionComponent.ShapeType;
import com.bigboots.components.BBComponent.CompType;
import com.bigboots.components.BBControlComponent;
import com.bigboots.core.BBSceneManager;

//Entity
import com.bigboots.components.BBEntity;
import com.bigboots.components.BBMeshComponent;
import com.bigboots.components.BBNodeComponent;
import com.bigboots.components.BBObject;
import com.bigboots.input.BBInputManager;
import com.bigboots.physics.BBPhysicsManager;
import com.jme3.animation.AnimChannel;
import com.jme3.animation.LoopMode;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.bullet.collision.shapes.CollisionShape;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.AnalogListener;
import com.jme3.input.controls.KeyTrigger;

import com.jme3.material.Material;
import com.jme3.math.Vector3f;
import com.jme3.scene.shape.Box;



/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class TestSimpleApp extends BBSimpleApplication{
    //Private variables
    AnimChannel pChannel;
    
    
    //The main function call to init the app
    public static void main(String[] args) {
        TestSimpleApp app = new TestSimpleApp();
        app.run();
    }   
    
    @Override
    public void simpleInitialize(){
        super.simpleInitialize();
        
        //Put here you custom init code ...
        //Example
        
        //Swithing physic on
        BBPhysicsManager.getInstance().init(engineSystem);
        //Set debub info on
        BBPhysicsManager.getInstance().setDebugInfo(true);
        
        //**********************************************************************
        //Create the main Character as an entity      
        BBEntity mMainPlayer = new BBEntity("PLAYER");
        //Set the entity tag. If it is a player or monster or static object like building etc
        mMainPlayer.setObjectTag(BBObject.ObjectTag.PLAYER);
        //Create first of all the translation component attached to the scene
        BBNodeComponent pnode = mMainPlayer.addComponent(CompType.NODE);
        pnode.setLocalTranslation(new Vector3f(1,1,1));
        mMainPlayer.attachToRoot();
        //Load the mesh file associated to this entity for visual
        mMainPlayer.loadModel("Models/Sinbad/Sinbad.mesh.j3o");
        //Set up an associated component. Here is animation
        BBAnimComponent panim = mMainPlayer.addComponent(CompType.ANIMATION);
        pChannel = panim.getChannel();
        pChannel.setAnim("IdleTop");
        pChannel.setSpeed(1f); 
        pChannel.setLoopMode(LoopMode.Cycle);
        
        //Create collision shape for our Entity by calling the PhysicMgr factory 
        CollisionShape pShape = BBPhysicsManager.getInstance().createPhysicShape(ShapeType.CAPSULE, mMainPlayer.getComponent(BBNodeComponent.class), 0.8f, 1.0f);
        pShape.setMargin(0.9f);
        //Create the collision component to attach the created shape
        BBCollisionComponent pColCp = mMainPlayer.addComponent(CompType.COLSHAPE);
        pColCp.attachShape(pShape);
        //Find and create the control to anime the shape
        CharacterControl pControler = (CharacterControl) BBAnimManager.getInstance().createControl(BBControlComponent.ControlType.CHARACTER, mMainPlayer); 
        pControler.setJumpSpeed(19);
        pControler.setFallSpeed(40);
        pControler.setGravity(35);
        pControler.setUseViewDirection(true);
        //Create the control component for our Entity and attach the specific control
        BBControlComponent pCtrl = mMainPlayer.addComponent(CompType.CONTROLLER);
        pCtrl.setControlType(BBControlComponent.ControlType.CHARACTER);
        pCtrl.attachControl(pControler);
        //Attached all to the Entity's Node and set it up in the physic space
        mMainPlayer.getComponent(BBNodeComponent.class).addControl(pControler);
        BBPhysicsManager.getInstance().getPhysicsSpace().addAll(mMainPlayer.getComponent(BBNodeComponent.class));
        
        //Trying Entity clone system to share texture and material
        BBEntity mCopy = mMainPlayer.clone("MYCOPY");
        mCopy.getComponent(BBNodeComponent.class).setLocalTranslation(new Vector3f(8,10,1));
        
        if(mMainPlayer.clonePhysic(mCopy)){
            BBPhysicsManager.getInstance().getPhysicsSpace().addAll(mCopy.getComponent(BBNodeComponent.class));
        }
    
        BBAnimComponent panimClone = mCopy.addComponent(CompType.ANIMATION);
        mCopy.getComponent(BBAnimComponent.class).getChannel().setAnim("IdleTop");
        mCopy.getComponent(BBAnimComponent.class).getChannel().setSpeed(1f); 
        mCopy.getComponent(BBAnimComponent.class).getChannel().setLoopMode(LoopMode.Cycle);

        mCopy.attachToRoot();

        //Set up material after cloning to see the shared texture
        mMainPlayer.setMaterial("Scenes/TestScene/TestSceneMaterial.j3m");
        mMainPlayer.setMaterialToMesh("Sinbad-geom-7", "Models/Sinbad/SinbadMat.j3m");
                
        //Create quick mesh and texture for floor
        Box floor = new Box(Vector3f.ZERO, 10f, 0.1f, 5f);
        Material floor_mat = BBSceneManager.getInstance().getAssetManager().loadMaterial("Materials/Scene/Character/CharacterSkin.j3m");
        //Set up a Geometry for our box 
        BBMeshComponent floor_geo = new BBMeshComponent("Floor", floor);
        floor_geo.setMaterial(floor_mat);
        floor_geo.setLocalTranslation(0, -1f, 0);
        BBSceneManager.getInstance().addChild(floor_geo);
        // Make the floor physical with mass 0.0f
        RigidBodyControl floor_phy = new RigidBodyControl(0.0f);
        floor_geo.addControl(floor_phy);
        BBPhysicsManager.getInstance().getPhysicsSpace().add(floor_phy);
        
        //Register specific input
        MyActionListener aListener = new MyActionListener();
        BBInputManager.getInstance().mapKey("ANIM_PLAYER", new KeyTrigger(KeyInput.KEY_M));
        BBInputManager.getInstance().getInputManager().addListener(aListener, "ANIM_PLAYER");
        
        //Disable free cam for making a custom one
        //mFreeCamera.setEnable(false);
        //Set up first person camera view for FPS game like
        //BBFirstPersonCamera mFirst = new BBFirstPersonCamera("FPS_CAM", cam);
        //mFirst.setTarget(pnode);
        //Set up third person camera view for RPG game like
        //BBThirdPersonCamera mThird = new BBThirdPersonCamera("RPG_CAM", cam);
        //mThird.setTarget(pnode);
        //mThird.initCamera();
    }
    
    @Override
    public void simpleUpdate(){
        super.simpleUpdate();
        //Put here your custom update code ...
        
    }
    
    //Specific internal class to handle input keys
    class MyActionListener implements AnalogListener, ActionListener{

        public void onAction(String binding, boolean keyPressed, float tpf) {
                   
            if (binding.equals("ANIM_PLAYER") && keyPressed){
                pChannel.setAnim("RunBase", 0.50f);
                pChannel.setLoopMode(LoopMode.Loop);
            }else{
                pChannel.setAnim("IdleTop", 0.50f);
                pChannel.setLoopMode(LoopMode.Loop);
            }
        }

        public void onAnalog(String name, float value, float tpf) {

        }
        
    }
 
}
