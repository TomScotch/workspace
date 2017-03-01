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

//import com.jme3.bullet.control.PhysicsControl;
import com.bigboots.physics.BBPhysicsManager;
import com.jme3.bullet.collision.PhysicsCollisionObject;
import com.jme3.bullet.control.*;
import com.jme3.scene.Node;


/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBControlComponent implements BBComponent{
    
    public enum ControlType {
        NONE,
        CHARACTER,
        VEHICULE,
        RIGIDBODY,
        GHOST,
        RAGDOLL
    }
    
    private PhysicsCollisionObject mControl;
    private ControlType mType;
    protected boolean mEnabled = true;
    
    public BBControlComponent(){
        mType = ControlType.NONE;
    }
    
    public void attachControl(PhysicsCollisionObject ctrl){
        mControl = ctrl;
    }
    public void setControlType(ControlType tp){
        mType  = tp;
    }
    
    public ControlType getControlType(){
        return mType;
    }
    
    public PhysicsCollisionObject getControl(){
        if(mType.equals(ControlType.CHARACTER)){
            return (CharacterControl) mControl;
        }
        return null;
    }
    
    public PhysicsControl clone(Node cloneNode){
        PhysicsControl physicCtrl = null;
        
        if(mType.equals(ControlType.CHARACTER)){
            physicCtrl = (CharacterControl) ((CharacterControl) mControl).cloneForSpatial(cloneNode);
        }
        return physicCtrl;
    }
    
    public CompType getCompType(){
        return CompType.CONTROLLER;
    }
    
    public CompFamily getCompFamily(){
        return CompFamily.PHYSICS;
    }
    
    public boolean isEnabled(){
        return mEnabled;
    }
    
    public void setEnable(boolean value){
        mEnabled = value;
    }
}
