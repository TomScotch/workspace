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

import com.bigboots.BBWorldManager;
import com.bigboots.core.BBSceneManager;
import com.bigboots.physics.BBPhysicsManager;


import com.jme3.terrain.geomipmap.TerrainQuad;
import com.jme3.asset.BlenderKey;
import com.jme3.asset.DesktopAssetManager;
import com.jme3.scene.Node;



/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class TestNavMesh extends BBSimpleApplication{
    //The main function call to init the app
    public static void main(String[] args) {
        TestNavMesh app = new TestNavMesh();
        app.run();
    }   
    
    protected TerrainQuad terrain;
    
    @Override
    public void simpleInitialize(){
        super.simpleInitialize();
        
        //Swithing physic on
        BBPhysicsManager.getInstance().init(engineSystem);

       
        // Load a blender file. 
        DesktopAssetManager dsk = (DesktopAssetManager) BBSceneManager.getInstance().getAssetManager();        
        BlenderKey bk = new BlenderKey("Scenes/TestScene/test_scene_01_1.blend");
        Node world =  (Node) dsk.loadModel(bk); 
        BBSceneManager.getInstance().addChild(world);
          
        BBWorldManager.getInstance().init();
        BBWorldManager.getInstance().createNavMesh(world);

    }
    
    @Override
    public void simpleUpdate(){
       super.simpleUpdate();

       
    } 
 
    
}
