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

import com.bigboots.components.BBNodeComponent;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.scene.CameraNode;
import com.jme3.scene.control.CameraControl.ControlDirection;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBSideModeCamera extends BBCameraComponent{
    
    protected CameraNode mCamNode;
    protected BBNodeComponent mTarget;
    
    public BBSideModeCamera(String name, Camera cam){
        super(name, cam);
        mCameraMode = CamMode.SIDE;
    }
    
    public void initCamera(){
        mCamNode = new CameraNode("Camera Node", mJm3Camera);
        mCamNode.setControlDir(ControlDirection.SpatialToCamera);
    }
    
    public void setTarget(BBNodeComponent node){
        mTarget = node;
        mCamNode.lookAt(mTarget.getLocalTranslation(), Vector3f.UNIT_Y);
        mTarget.attachChild(mCamNode);
    }
    
    public void stopCamera(){
        
    }
    
    public void setPosition(Vector3f vec){
        mCamNode.setLocalTranslation(vec);
    }

    @Override
    public void udpate() {
        
    }
}
