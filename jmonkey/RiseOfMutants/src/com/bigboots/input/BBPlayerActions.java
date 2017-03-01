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
package com.bigboots.input;


import com.bigboots.components.BBAnimComponent;
import com.bigboots.components.BBAudioComponent;
import com.bigboots.components.BBNodeComponent;
import com.bigboots.components.BBPlayerManager;
import com.bigboots.core.BBSceneManager;
import com.jme3.animation.AnimChannel;
import com.jme3.animation.LoopMode;
import com.jme3.bullet.collision.shapes.SphereCollisionShape;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.AnalogListener;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.math.Transform;
import com.jme3.math.Vector3f;
import com.jme3.renderer.queue.RenderQueue.ShadowMode;
import com.jme3.scene.Geometry;
import com.jme3.scene.shape.Sphere;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBPlayerActions implements  ActionListener, AnalogListener{
    private Material matBullet;
    //bullet
    private Sphere bullet;
    private SphereCollisionShape bulletCollisionShape;
    //explosion
    //private ParticleEmitter effect;
    private Quaternion newRot;
    private float time = 0;
    private int pressed=0;
    private static final Logger logger = Logger.getLogger(BBPlayerActions.class.getName());
//    private boolean shootBullets = false;
    int timeBullet = 0;
    BBPlayerBulletControl bulletMove;
    
    
    public BBPlayerActions(){
        prepareBullet();
    }

    
    private static final class Directions{
        private static final Quaternion rot = new Quaternion().fromAngleAxis(-FastMath.HALF_PI, Vector3f.UNIT_Y);
        private static final Quaternion upDir = Quaternion.DIRECTION_Z.mult(rot);
        private static final Quaternion rightDir = upDir.mult(rot);
        private static final Quaternion downDir = rightDir.mult(rot);
        private static final Quaternion leftDir = downDir.mult(rot);
    }
        
    public void onAction(String binding, boolean keyPressed, float tpf) {
                    
            if(keyPressed == true && !binding.equals("MOUSE_LEFT") && !binding.equals("MOUSE_RIGHT")){
                pressed++;
                //System.out.println("***** PRESSED : "+pressed);
            }
            if(keyPressed == false && !binding.equals("MOUSE_LEFT") && !binding.equals("MOUSE_RIGHT")){
                pressed--;
                //System.out.println("***** RELEASED : "+pressed);
            }
            
            BBNodeComponent pNode = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class);
            AnimChannel pChannel = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBAnimComponent.class).getChannel();
            CharacterControl pCharCtrl = pNode.getControl(CharacterControl.class);
            BBAudioComponent pStep = BBPlayerManager.getInstance().getMainPlayer().getAudio("STEP");
            
            if(pressed==1 && keyPressed && !binding.equals("Jump") && !binding.equals("MOUSE_LEFT") && !binding.equals("MOUSE_RIGHT") 
               && !BBPlayerManager.getInstance().isWalking()){
//            if(pressed==1 && keyPressed &! binding.equals("Jump")  && !BBPlayerManager.getInstance().isWalking()){
                BBPlayerManager.getInstance().setIsWalking(true);
                
                if(!BBPlayerManager.getInstance().isJumping()){
                    BBPlayerManager.getInstance().setIsWalking(true);
                    logger.log(Level.INFO,"Character walking init.");
                    pChannel.setAnim("run_01", 0.50f); // TODO: Must be activated after a certain time after "RunTop"
                    pChannel.setLoopMode(LoopMode.Loop);
              
                    //Trying to repeat the walk sound
                    time += tpf;
                    if (time > 0f) {
                        pStep.play();
                        time = 0;
                    }
                }
            } else if (pressed==0 &! keyPressed &! binding.equals("Jump") && !BBPlayerManager.getInstance().getSwordStrike() && !binding.equals("MOUSE_LEFT")) {
                BBPlayerManager.getInstance().setIsWalking(false);
                if(!BBPlayerManager.getInstance().isJumping()){
                    logger.log(Level.INFO,"Character walking end.");
                    pChannel.setAnim("base_stand", 0.50f);          
                    pChannel.setLoopMode(LoopMode.DontLoop);
                    pStep.stop();
                }
            }
           
            if(!keyPressed && binding.equals("MOUSE_LEFT")){
                if(!BBPlayerManager.getInstance().isJumping()){
                    BBPlayerManager.getInstance().setIsWalking(false);
                    logger.log(Level.INFO,"******  Character Attack 1.");
                    BBPlayerManager.getInstance().getMainPlayer().getAudio("FIRE").play();
                    pChannel.setAnim("shoot", 0.05f);
                    pChannel.setLoopMode(LoopMode.DontLoop);
//                    shootBullets = true;
                    bulletControl();
                    Geometry bulletx = bulletg.clone();
                    BBSceneManager.getInstance().getRootNode().attachChild(bulletx);
                    bulletx.addControl(bulletMove = new BBPlayerBulletControl(bulletx, this));
                    
                }
                
            } 
//            else {
//                shootBullets = false;
//            }
            if(!keyPressed && BBPlayerManager.getInstance().getSwordStrike() == false && binding.equals("MOUSE_RIGHT")){
                if(!BBPlayerManager.getInstance().isJumping()){
                    BBPlayerManager.getInstance().setIsWalking(false);
                    logger.log(Level.INFO,"******  Character Attack 2.");
                    pChannel.setAnim("strike_sword", 0.05f);
                    pChannel.setSpeed(1.3f);
                    pChannel.setLoopMode(LoopMode.DontLoop);
                    BBPlayerManager.getInstance().setSwordStrike(true);
                }
                
            }
          
            
            if (binding.equals("Jump") &! BBPlayerManager.getInstance().isJumping() ) {
                if (keyPressed){
                    logger.log(Level.INFO,"Character jumping start.");
                    BBPlayerManager.getInstance().setIsJumping(true);
                    pCharCtrl.jump();
                    pChannel.setAnim("jump", 0.50f); // TODO: Must be activated after a certain time after "JumpStart"
                    pChannel.setLoopMode(LoopMode.DontLoop);
                }
            }
        }//end onAAction
        
              
        public void onAnalog(String binding, float value, float tpf) {
            
            BBNodeComponent pNode = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class);
            CharacterControl pCharCtrl = pNode.getControl(CharacterControl.class);
            
            if(!BBPlayerManager.getInstance().isJumping()){
                //We inverse the key because the map is align on X axis        
                //left
                if (binding.equals("Down")) {
                    newRot = new Quaternion().slerp(pNode.getLocalRotation(),Directions.leftDir, tpf*7);
                    pNode.setLocalRotation(newRot);
                }//right
                else if (binding.equals("Up")) {
                    newRot = new Quaternion().slerp(pNode.getLocalRotation(),Directions.rightDir, tpf*7);
                    pNode.setLocalRotation(newRot);        

                }//up 
                else if (binding.equals("Left")) {
                    newRot = new Quaternion().slerp(pNode.getLocalRotation(),Directions.upDir, tpf*7);
                    pNode.setLocalRotation(newRot);
                } //down
                else if (binding.equals("Right")) {
                    newRot = new Quaternion().slerp(pNode.getLocalRotation(),Directions.downDir, tpf*7);
                    pNode.setLocalRotation(newRot);
                }

                if(BBPlayerManager.getInstance().isWalking()){
                    pCharCtrl.setViewDirection(pNode.getWorldRotation().mult(Vector3f.UNIT_Z));                     
                    pCharCtrl.setWalkDirection(pNode.getControl(CharacterControl.class).getViewDirection().multLocal(.17f));                  
                }        
                else{
                    pCharCtrl.setWalkDirection(Vector3f.ZERO);
                }
            
            }


            

        }//end onAnalog
        

        
   // private Mesh bullet;
 //   private Material matBullet;
    private Geometry bulletg;
    private Transform bulletTrans;
    private Vector3f frontVec;

        private void prepareBullet() {
            bullet = new Sphere(8, 8, 0.2f, true, false);
            matBullet = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
            matBullet.setColor("Color", ColorRGBA.Yellow);
            bulletg = new Geometry("bullet", bullet);
            bulletg.setMaterial(matBullet);
            bulletg.setShadowMode(ShadowMode.Off);
            //BBPhysicsManager.getInstance().getPhysicsSpace().addCollisionListener(this);
        }

        
    private void bulletControl() { 
        bulletTrans = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class).getWorldTransform();
        bulletg.setLocalTranslation(bulletTrans.getTranslation());
        bulletg.setLocalRotation(bulletTrans.getRotation());
        frontVec = bulletTrans.getRotation().mult(Vector3f.UNIT_Z).normalize();
        bulletg.move(frontVec.mult(0.7f));
        float yAx = bulletg.getLocalTranslation().y +0.5f;
        bulletg.setLocalTranslation(bulletg.getLocalTranslation().x, yAx, bulletg.getLocalTranslation().z);

    }        
        
        
        
        // Commented as deprecated
//  private void prepareBullet() {
//            bullet = new Sphere(8, 8, 0.2f, true, false);
//            bullet.setTextureMode(TextureMode.Projected);
//            bulletCollisionShape = new SphereCollisionShape(0.3f);
//            matBullet = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
//            matBullet.setColor("Color", ColorRGBA.Yellow);
//            matBullet.setColor("m_GlowColor", ColorRGBA.Orange);
//            
//            //BBPhysicsManager.getInstance().getPhysicsSpace().addCollisionListener(this);
//        }
//        
//        private void bulletControl() {
//            
//            CharacterControl character = BBPlayerManager.getInstance().getMainPlayer().getComponent(BBNodeComponent.class).getControl(CharacterControl.class);
//            
//            Geometry bulletg = new Geometry("bullet", bullet);
//            bulletg.setMaterial(matBullet);
//            bulletg.setShadowMode(ShadowMode.Off);
//            Vector3f pos = character.getPhysicsLocation().add(character.getViewDirection().mult(10));
//            pos.y = pos.y + 1.0f;
//            pos.z = pos.z + 0.4f;
//            bulletg.setLocalTranslation(pos);
//            RigidBodyControl bulletControl = new BBBulletPhysic(bulletCollisionShape, 1);
//            bulletControl.setCcdMotionThreshold(0.1f);
//            Vector3f vec = character.getViewDirection().add(new Vector3f(0,0.05f,0)).normalize();
//            bulletControl.setLinearVelocity(vec.mult(20));
//            bulletg.addControl(bulletControl);
//            BBSceneManager.getInstance().addChild(bulletg);
//            BBPhysicsManager.getInstance().getPhysicsSpace().add(bulletControl);
//    } 
}
