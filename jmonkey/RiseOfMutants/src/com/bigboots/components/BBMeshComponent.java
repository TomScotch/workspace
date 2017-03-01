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

import com.jme3.scene.Geometry;
import com.jme3.scene.Mesh;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBMeshComponent extends Geometry implements BBComponent{
    protected boolean mEnabled = true;
    
    public BBMeshComponent( ){
        super();
    }
    
    public BBMeshComponent(String name){
        super(name);
    }
        /**
     * Create a geometry node with mesh data.
     * The material of the geometry is null, it cannot
     * be rendered until it is set.
     * 
     * @param name The name of this geometry
     * @param mesh The mesh data for this geometry
     */
    public BBMeshComponent(String name, Mesh mesh) {
        super(name, mesh);
    }
    
    public CompType getCompType() {
        return CompType.MESH;
    }

    public CompFamily getCompFamily() {
        return CompFamily.VISUAL;
    }
    
    public boolean isEnabled(){
        return mEnabled;
    }
    
    public void setEnable(boolean value){
        mEnabled = value;
    }
}
