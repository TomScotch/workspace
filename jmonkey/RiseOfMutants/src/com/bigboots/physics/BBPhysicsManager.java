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

import com.bigboots.components.BBCollisionComponent.ShapeType;
import com.bigboots.core.BBEngineSystem;
import com.bigboots.core.BBSceneManager;
import com.bigboots.core.BBUpdateListener;
import com.bigboots.core.BBUpdateManager;
import com.jme3.app.Application;
import com.jme3.app.state.AppStateManager;
import com.jme3.bounding.BoundingBox;
import com.jme3.bullet.BulletAppState;
import com.jme3.bullet.PhysicsSpace;
import com.jme3.bullet.collision.shapes.*;
import com.jme3.bullet.util.CollisionShapeFactory;
import com.jme3.math.Plane;
import com.jme3.math.Vector3f;
import com.jme3.scene.Geometry;
import com.jme3.scene.Node;


/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBPhysicsManager extends Application implements BBUpdateListener{
    private static BBPhysicsManager instance = new BBPhysicsManager();

    private BBPhysicsManager() {
    }
    
    public static BBPhysicsManager getInstance() { 
        return instance; 
    }
    
    private BulletAppState bulletAppState;
    private BBEngineSystem engineSystem;
    private boolean mShowPhysicDebug = false;
    
    public void update(float tpf) {
        //throw new UnsupportedOperationException("Not supported yet.");
               
        // update states need by Bullet
        stateManager.update(tpf);
        // render states
        stateManager.render(engineSystem.getRenderManager());
        stateManager.postRender();
    }
    
    public void init(BBEngineSystem eng){
        engineSystem = eng;
        stateManager = new AppStateManager(this);
        // Set up Physics
        bulletAppState = new BulletAppState();
        stateManager.attach(bulletAppState);
        
        BBUpdateManager.getInstance().register(this);
    }
   
    public CollisionShape createPhysicShape(ShapeType type, Node nodeCollision, float widthScale, float HeightScale){
        
        Node node = nodeCollision;
        BoundingBox vol = (BoundingBox) node.getWorldBound();

        if(type.equals(ShapeType.CAPSULE)){
            CapsuleCollisionShape enShape = new CapsuleCollisionShape(Math.max(vol.getXExtent(), vol.getZExtent())*widthScale, vol.getYExtent()*HeightScale, 1);
            return enShape;
        }
                if(type.equals(ShapeType.BOX)){
            BoxCollisionShape enShape = new BoxCollisionShape(new Vector3f(vol.getXExtent()*widthScale, vol.getYExtent()*HeightScale, vol.getZExtent()*widthScale));
            return enShape;
        }
                if(type.equals(ShapeType.CYLINDER)){
            CylinderCollisionShape enShape = new CylinderCollisionShape(new Vector3f(Math.max(vol.getXExtent(), vol.getZExtent())*widthScale, vol.getYExtent()*HeightScale, Math.max(vol.getXExtent(), vol.getZExtent())*widthScale), 1);
            return enShape;
        }                
                if(type.equals(ShapeType.PLANE)){
            PlaneCollisionShape enShape = new PlaneCollisionShape(new Plane(node.getWorldRotation().mult(Vector3f.UNIT_XYZ), Math.max(vol.getXExtent(), vol.getZExtent())));
            return enShape;
        }                
                if(type.equals(ShapeType.CONE)){
            ConeCollisionShape enShape = new ConeCollisionShape(Math.max(vol.getXExtent(), vol.getZExtent())*widthScale, vol.getYExtent(), 1);
            return enShape;
        }                
                if(type.equals(ShapeType.HULL)){
            Geometry geo = (Geometry) node.getChild(0);
            HullCollisionShape enShape = new HullCollisionShape(geo.getMesh());
            return enShape;
        }                
                if(type.equals(ShapeType.MESH)){
            Geometry geo = (Geometry) node.getChild(0);        
            MeshCollisionShape mshShape = new MeshCollisionShape(geo.getMesh());
            return mshShape;
        }
                if(type.equals(ShapeType.SPHERE)){
            SphereCollisionShape mshShape = new SphereCollisionShape(Math.max(Math.max(vol.getXExtent(), vol.getZExtent()), vol.getYExtent()));
            return mshShape;
        }
               if(type.equals(ShapeType.COMPLEX)){
            CollisionShape mComplexShape = CollisionShapeFactory.createMeshShape(node);
            return mComplexShape;
        }
        
        return null;
    }
    
    public void setDebugInfo(boolean value){
        mShowPhysicDebug = value;
        if(value){
            bulletAppState.getPhysicsSpace().enableDebug(BBSceneManager.getInstance().getAssetManager());
        }else {
            bulletAppState.getPhysicsSpace().disableDebug();
        }
    }
    
    @Override
    public void initialize(){
        
    }  
    @Override
    public void destroy(){
        //bulletAppState.getPhysicsSpace().removeAll(worldRoot);        
        stateManager.detach(bulletAppState);
        bulletAppState.getPhysicsSpace().destroy();
        super.destroy();
    }
    @Override
    public void handleError(String errMsg, Throwable t){        
    }
    @Override
    public void gainFocus(){        
    }
    @Override
    public void loseFocus(){       
    }
    @Override
    public void requestClose(boolean esc){    
    }
    @Override
    public void update(){      
    }
    
    public void removePhysic(Node node){
        this.getPhysicsSpace().removeAll(node);
    }
    
    public BulletAppState getBulletApp(){
        return bulletAppState;
    }
    
    public PhysicsSpace getPhysicsSpace() {
        return bulletAppState.getPhysicsSpace();
    }
    
    public boolean isShowDebug(){
        return mShowPhysicDebug;
    }
    
}
