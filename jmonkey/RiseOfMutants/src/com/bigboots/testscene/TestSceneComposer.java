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


import com.bigboots.core.BBSceneManager;
import com.bigboots.physics.BBPhysicsManager;
import com.bigboots.scene.BBSceneComposer;
import com.bigboots.scene.BBShaderManager;
import com.jme3.asset.BlenderKey;
import com.jme3.asset.DesktopAssetManager;
import com.jme3.asset.ModelKey;

import com.jme3.math.*;
import com.jme3.scene.Node;




public class TestSceneComposer extends BBSimpleApplication {

    public static void main(String[] args) {
        TestSceneComposer app = new TestSceneComposer();
        app.run();
    }


    @Override
    public void simpleInitialize() {
        super.simpleInitialize();
        
        //Set up the physic engine
        BBPhysicsManager.getInstance().init(engineSystem);
          
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

        // ShaderManager test
        BBShaderManager shm = new BBShaderManager(BBSceneManager.getInstance().getRootNode(), BBSceneManager.getInstance().getAssetManager());
        shm.setSimpleIBLParam("Textures/skyboxes/sky_box_01/skybox_01_low.png");   
        shm.setFogParam(new ColorRGBA(0.67f,0.55f,0.2f, 70f), null);
        
    }

    
    @Override
    public void simpleUpdate(){
        super.simpleUpdate();
        
        //Put here your custom update code ...
        
    } 
    
}
