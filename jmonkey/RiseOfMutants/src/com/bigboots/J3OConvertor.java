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
package com.bigboots;


import com.bigboots.scene.*;
import com.jme3.app.Application;
import com.jme3.system.JmeContext;


/**
 *
 * @author mifth
 */
public class J3OConvertor extends Application {

    public static void main(String[] args) {
        
        J3OConvertor app = new J3OConvertor();
        app.start(JmeContext.Type.Headless);

    }    
    
    
    
        @Override
    public void initialize() {
          
        super.initialize();
        
        // call user code
        SceneLoading sceneL = new SceneLoading(assetManager);
        System.out.println("ENDDDDDDDDDDDDDDDDD");
        
        super.requestClose(true);
        
    }
    
}    