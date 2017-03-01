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
package com.bigboots.physics;

import com.bigboots.components.BBAnimComponent;
import com.bigboots.components.BBAudioComponent;
import com.bigboots.components.BBEntity;
import com.bigboots.components.BBMonsterManager;
import com.bigboots.core.BBSceneManager;
import com.bigboots.gui.BBGuiManager;
import com.bigboots.gui.BBProgressbarController;
import com.jme3.animation.LoopMode;
import com.jme3.bullet.PhysicsSpace;
import com.jme3.bullet.PhysicsTickListener;
import com.jme3.bullet.collision.PhysicsCollisionEvent;
import com.jme3.bullet.collision.PhysicsCollisionListener;
import com.jme3.bullet.collision.PhysicsCollisionObject;
import com.jme3.bullet.collision.shapes.CollisionShape;
import com.jme3.bullet.collision.shapes.SphereCollisionShape;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.bullet.objects.PhysicsGhostObject;
import com.jme3.bullet.objects.PhysicsRigidBody;
import com.jme3.effect.ParticleEmitter;
import com.jme3.effect.ParticleMesh.Type;
import com.jme3.effect.shapes.EmitterSphereShape;
import com.jme3.export.JmeExporter;
import com.jme3.export.JmeImporter;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import java.io.IOException;
import java.util.Iterator;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBBulletPhysic extends RigidBodyControl implements PhysicsCollisionListener, PhysicsTickListener {
    private float explosionRadius = 10;
    private PhysicsGhostObject ghostObject;
    private Vector3f vector = new Vector3f();
    private Vector3f vector2 = new Vector3f();
    private float forceFactor = 1;
    private ParticleEmitter effect;
    private float fxTime = 0.5f;
    private float maxTime = 4f;
    private float curTime = -1.0f;
    private float timer;
    private BBAudioComponent expSound;

    public BBBulletPhysic(CollisionShape shape, float mass) {
        super(shape, mass);
        createGhostObject();
        prepareEffect();
        
        expSound = new BBAudioComponent();
        expSound.setSoundName("Sounds/explosionLarge2.ogg", false);
        expSound.setLooping(false);
        expSound.setVolume(10);
    }

    @Override
    public void setPhysicsSpace(PhysicsSpace space) {
        super.setPhysicsSpace(space);
        if (space != null) {
            space.addCollisionListener(this);
        }
    }

    private void prepareEffect() {
        int COUNT_FACTOR = 1;
        float COUNT_FACTOR_F = 1f;
        effect = new ParticleEmitter("Flame", Type.Triangle, 32 * COUNT_FACTOR);
        effect.setSelectRandomImage(true);
        effect.setStartColor(new ColorRGBA(1f, 0.4f, 0.05f, (float) (1f / COUNT_FACTOR_F)));
        effect.setEndColor(new ColorRGBA(.4f, .22f, .12f, 0f));
        effect.setStartSize(1.3f);
        effect.setEndSize(2f);
        effect.setShape(new EmitterSphereShape(Vector3f.ZERO, 1f));
        effect.setParticlesPerSec(0);
        effect.setGravity(0, -5f, 0);
        effect.setLowLife(.4f);
        effect.setHighLife(.5f);
        effect.setImagesX(2);
        effect.setImagesY(2);
        Material mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Particle.j3md");
        mat.setTexture("Texture", BBSceneManager.getInstance().getAssetManager().loadTexture("Effects/Explosion/flame.png"));
        effect.setMaterial(mat);
    }

    protected void createGhostObject() {
     //   ghostObject = new PhysicsGhostObject(new SphereCollisionShape(explosionRadius));
    }

    public void collision(PhysicsCollisionEvent event) {
        if (space == null) {
            return;
        }
        
        if (event.getObjectA() == this || event.getObjectB() == this) {
//            System.out.println("*******!!! COLLISION FOR BULLET !!!**********");
//            space.add(ghostObject);
//            ghostObject.setPhysicsLocation(getPhysicsLocation(vector));
//            space.addTickListener(this);
            if (effect != null && spatial.getParent() != null) {
                curTime = 0;
                effect.setLocalTranslation(spatial.getWorldTranslation());
                spatial.getParent().attachChild(effect);
                effect.emitAllParticles();
                expSound.play();
            }
            space.remove(this);
            spatial.getControl(RigidBodyControl.class).setEnabled(false);
            spatial.getControl(RigidBodyControl.class).destroy();
            spatial.removeFromParent();
            spatial = null;
            
            
            if (event.getObjectA() instanceof CharacterControl){
/*                System.out.println("*******!!! BULLET HIT OBJECT ["+ event.getObjectA().toString() +"] ON Object A !!!**********");
                System.out.println("*******!!! BULLET HIT NODE ["+ event.getNodeA().getName() +"] ON Object A !!!**********");
                System.out.println("*******!!! COLLISION A IMPULSE : "+event.getAppliedImpulse());
                System.out.println("*******!!! COLLISION A FRICTION : "+event.getCombinedFriction());
                System.out.println("*******!!! COLLISION A RESTITUTION : "+event.getCombinedRestitution());
                System.out.println("*******!!! COLLISION A DISTANCE : "+event.getDistance1());
 */             
                //TODO : Next time retreive the entity object from the world manager and not from monster manager
                // with entity TAG check if it is player or monster
                BBEntity tmpEnt = BBMonsterManager.getInstance().getMonster(event.getNodeA().getName());
                int health = (Integer) tmpEnt.getSkills("HEALTH");
                health = (int) (health - event.getCombinedFriction());
                BBGuiManager.getInstance().getNifty().getScreen("hud").findControl("enemy_progress", BBProgressbarController.class).setProgress(health / 100.0f);
                //System.out.println("*******!!! HEAlTH : "+health);
                if(health <= 0){
                    tmpEnt.stopAllAudio();
                    tmpEnt.setSkills("HEALTH", 0);
                    tmpEnt.setEnabled(false);
                    tmpEnt.getComponent(BBAnimComponent.class).getChannel().setAnim("mutant_death", 0.50f);
                    tmpEnt.getComponent(BBAnimComponent.class).getChannel().setLoopMode(LoopMode.DontLoop);
                }else{
                    tmpEnt.setSkills("HEALTH", health);
                }
                
            }else if(event.getObjectB() instanceof CharacterControl){
                //TODO : Next time retreive the entity object from the world manager and not from monster manager
                // with entity TAG check if it is player or monster
                BBEntity tmpEnt = BBMonsterManager.getInstance().getMonster(event.getNodeB().getName());
                int health = (Integer) tmpEnt.getSkills("HEALTH");
                health = (int) (health - event.getCombinedFriction());
                BBGuiManager.getInstance().getNifty().getScreen("hud").findControl("enemy_progress", BBProgressbarController.class).setProgress(health / 100.0f);
                //System.out.println("*******!!! HEAlTH : "+health);
                if(health <= 0){
                    tmpEnt.stopAllAudio();
                    tmpEnt.setSkills("HEALTH", 0);
                    tmpEnt.setEnabled(false);
                    tmpEnt.getComponent(BBAnimComponent.class).getChannel().setAnim("mutant_death", 0.50f);
                    tmpEnt.getComponent(BBAnimComponent.class).getChannel().setLoopMode(LoopMode.DontLoop);
                    
                }else{
                    tmpEnt.setSkills("HEALTH", health);
                    
                }
            }
            
        }
    }
    
    public void prePhysicsTick(PhysicsSpace space, float f) {
        space.removeCollisionListener(this);
    }

    public void physicsTick(PhysicsSpace space, float f) {
//        //get all overlapping objects and apply impulse to them
//        for (Iterator<PhysicsCollisionObject> it = ghostObject.getOverlappingObjects().iterator(); it.hasNext();) {            
//            PhysicsCollisionObject physicsCollisionObject = it.next();
//            if (physicsCollisionObject instanceof PhysicsRigidBody) {
//                PhysicsRigidBody prBody = (PhysicsRigidBody) physicsCollisionObject;
//                prBody.getPhysicsLocation(vector2);
//                vector2.subtractLocal(vector);
//                float force = explosionRadius - vector2.length();
//                force *= forceFactor;
//                force = force > 0 ? force : 0;
//                vector2.normalizeLocal();
//                vector2.multLocal(force);
//                ((PhysicsRigidBody) physicsCollisionObject).applyImpulse(vector2, Vector3f.ZERO);
//            }
//        }
//        space.removeTickListener(this);
//        space.remove(ghostObject);
    }

    @Override
    public void update(float tpf) {
        super.update(tpf);
        
        
        if(enabled){
            timer+=tpf;
            if(timer>maxTime){
                expSound.destroy();
                if(spatial.getParent()!=null){
                    space.removeCollisionListener(this);
                    space.remove(this);
                    spatial.getControl(RigidBodyControl.class).setEnabled(false);
                    spatial.getControl(RigidBodyControl.class).destroy();
                    spatial.removeFromParent();
                    spatial = null;
                }
               timer = 0; 
            }
        }
        if (enabled && curTime >= 0) {
            curTime += tpf;
            if (curTime > fxTime) {
                curTime = -1;
                effect.removeFromParent();
                effect = null;
            }
        }
    }

    /**
     * @return the explosionRadius
     */
    public float getExplosionRadius() {
        return explosionRadius;
    }

    /**
     * @param explosionRadius the explosionRadius to set
     */
    public void setExplosionRadius(float explosionRadius) {
        this.explosionRadius = explosionRadius;
        createGhostObject();
    }

    public float getForceFactor() {
        return forceFactor;
    }

    public void setForceFactor(float forceFactor) {
        this.forceFactor = forceFactor;
    }
    
    
    @Override
    public void read(JmeImporter im) throws IOException {
        throw new UnsupportedOperationException("Reading not supported.");
    }

    @Override
    public void write(JmeExporter ex) throws IOException {
        throw new UnsupportedOperationException("Saving not supported.");
    }
    
}


