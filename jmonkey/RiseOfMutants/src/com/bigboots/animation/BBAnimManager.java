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
package com.bigboots.animation;

import com.bigboots.components.BBCollisionComponent;
import com.bigboots.components.BBControlComponent.*;
import com.bigboots.components.BBEntity;
import com.bigboots.core.BBSceneManager;
import com.jme3.bullet.collision.PhysicsCollisionObject;
import com.jme3.bullet.control.CharacterControl;
//import com.jme3.scene.control.Control;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBAnimManager {
    private static BBAnimManager instance = new BBAnimManager();

    private BBAnimManager() {
    }
    
    public static BBAnimManager getInstance() { 
        return instance; 
    }
    
    public PhysicsCollisionObject createControl(ControlType type, BBEntity ent){
        
        if(type.equals(ControlType.CHARACTER)){
            
            CharacterControl eControler = new CharacterControl(ent.getComponent(BBCollisionComponent.class).getShape(), .05f);
            //eControler.createDebugShape(BBSceneManager.getInstance().getAssetManager());
            //BBSceneManager.getInstance().getRootNode().attachChild(eControler.debugShape());
            return eControler;
        }
        return null;
    }
}
