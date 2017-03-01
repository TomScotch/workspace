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

import com.jme3.renderer.Camera;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBCameraManager {
    private static BBCameraManager instance = new BBCameraManager();

    private BBCameraManager() {
    }
    
    public static BBCameraManager getInstance() { 
        return instance; 
    }
   
    private BBCameraComponent mCurrentCamera;
    private List<BBCameraComponent> mCameraList = new ArrayList<BBCameraComponent>();
    
    
    public void registerCamera(String name, BBCameraComponent.CamMode mode, Camera cam, boolean dflt){
        switch (mode) {
            case SIDE :
                BBSideModeCamera sideCam = new BBSideModeCamera(name, cam);
                sideCam.initCamera();
                mCameraList.add(sideCam);
                if(dflt){
                    mCurrentCamera = sideCam;
                }
                
            break;               
            case FPS :
                BBFirstPersonCamera fpsCam = new BBFirstPersonCamera(name, cam);
                mCameraList.add(fpsCam);
                if(dflt){
                    mCurrentCamera = fpsCam;
                }
            break;
            case ORBITAL :
                BBThirdPersonCamera orbCam = new BBThirdPersonCamera(name, cam);
                mCameraList.add(orbCam);
                if(dflt){
                    mCurrentCamera = orbCam;
                }
            break;
            default: 
                throw new RuntimeException("None or unsupported Filter Type");
        }
    }
    
    public void setCurrentCamera(BBCameraComponent cmp){
        mCurrentCamera = cmp;
    }
    
    public BBCameraComponent getCurrentCamera(){
        return mCurrentCamera;
    }
    
    public BBCameraComponent getCameraByName(String name){
        for (BBCameraComponent cm : mCameraList) {
            if(name.equals(cm.getCamName())){
                return cm;
            }
        }
        return null;
    }
    
    public void update(){
        mCurrentCamera.udpate();
    }
}
