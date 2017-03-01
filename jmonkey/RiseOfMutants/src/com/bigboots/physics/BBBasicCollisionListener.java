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

import com.jme3.bullet.collision.PhysicsCollisionEvent;
import com.jme3.bullet.collision.PhysicsCollisionListener;
//import com.jme3.scene.Node;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBBasicCollisionListener implements PhysicsCollisionListener{
    
    public BBBasicCollisionListener(){
        
    }
    
    
    public void collision(PhysicsCollisionEvent event) {
        //System.out.println("*******!!! BASIC COLLISION EVENT "+ event.getNodeA().getName()+" !!!**********");
        if ( event.getNodeA().getName().equals("PLAYER") ) {
            final Node node = (Node) event.getNodeA();
            //System.out.println("*******!!! COLLISION FOR PLAYER in Node A !!!**********");
            
        } 
        else{
            final Node node = (Node) event.getNodeB();
            //System.out.println("*******!!! COLLISION FOR PLAYER in Node B !!!**********");
        }
    }
}
