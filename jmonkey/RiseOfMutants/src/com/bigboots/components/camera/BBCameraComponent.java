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
package com.bigboots.components.camera;

import com.bigboots.components.BBComponent;
import com.bigboots.components.BBComponent.CompFamily;
import com.bigboots.components.BBComponent.CompType;
import com.jme3.renderer.Camera;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public abstract class BBCameraComponent implements BBComponent{
    public enum CamMode{
        NONE,
        FPS,
        SIDE,
        RTS,
        CHASE,
        FIXED,
        ORBITAL,
        FREE
    }
    
    protected CamMode mCameraMode;    
    protected String mCameraName;
    protected boolean mEnabled = true;
    protected Camera mJm3Camera;
    
    public BBCameraComponent(String name, Camera cam){
        mCameraName = name;
        mJm3Camera = cam;
    }
    
    public Camera getEngineCamera(){
        return mJm3Camera;
    }
    
    public CamMode getCamMode(){
        return mCameraMode;
    }    
    
    public String getCamName(){
        return mCameraName;
    }
    
    public CompType getCompType(){
        return CompType.CAMERA;
    }
    
    public CompFamily getCompFamily(){
        return CompFamily.VISUAL;
    }
    /**
     * @return If enabled
     * @see BBCameraComponent#setEnabled(boolean)
     */
    public boolean isEnabled(){
        return mEnabled;
    }
    
    public void setEnable(boolean value){
        mEnabled = value;
    }
    
    public abstract void udpate();
}
