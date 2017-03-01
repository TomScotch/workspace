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
import com.jme3.math.Quaternion;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.scene.CameraNode;
import com.jme3.scene.control.CameraControl.ControlDirection;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBThirdPersonCamera extends BBCameraComponent{
    private BBNodeComponent mTargetNode;
    protected float minDistance = 1.0f;
    protected float maxDistance = 40.0f;
    protected CameraNode mCamNode;
    private Quaternion mRotation;
    
    public BBThirdPersonCamera(String name, Camera cam){
        super(name, cam);
        mCameraMode = CamMode.ORBITAL;
    }
    
    public void initCamera(){
        mJm3Camera.setParallelProjection( false );
        Vector3f loc = new Vector3f( 0.0f, 0.0f, 25.0f );
        Vector3f left = new Vector3f( -1.0f, 0.0f, 0.0f );
        Vector3f up = new Vector3f( 0.0f, 1.0f, 0.0f );
        Vector3f dir = new Vector3f( 0.0f, 0f, -1.0f );
        // Move our camera to a correct place and orientation.
        mJm3Camera.setFrame( loc, left, up, dir );
        // Signal that we've changed our camera's data
        mJm3Camera.update();

        Vector3f targetOffset = new Vector3f();
        targetOffset.y = 5;
        //ChaseCamera chaser = new ChaseCamera( cam, target.getCharacterNode() );
        //chaser.setTargetOffset(targetOffset);
        mCamNode = new CameraNode("THIRD_NODE", mJm3Camera);
        mCamNode.setControlDir(ControlDirection.SpatialToCamera);
        this.setPosition(new Vector3f(-20,8,0));
        Quaternion x = new Quaternion().fromAngleAxis(0, Vector3f.UNIT_X);
        Quaternion y = new Quaternion().fromAngleAxis(180, Vector3f.UNIT_Y);
        Quaternion z = new Quaternion().fromAngleAxis(0, Vector3f.UNIT_Z);
        
        mRotation = new Quaternion(z.mult(y).mult(x));
    }
    
    public void setPosition(Vector3f vec){
        mCamNode.setLocalTranslation(vec);
    }
    
    public void setTarget(BBNodeComponent node){
        mTargetNode = node;
        mCamNode.lookAt(mTargetNode.getLocalTranslation(), Vector3f.UNIT_Y);
        mTargetNode.attachChild(mCamNode);
    }

    /**
     * Returns the max zoom distance of the camera (default is 40)
     * @return maxDistance
     */
    public float getMaxDistance() {
        return maxDistance;
    }

    /**
     * Sets the max zoom distance of the camera (default is 40)
     * @param maxDistance
     */
    public void setMaxDistance(float maxDistance) {
        this.maxDistance = maxDistance;
    }

    /**
     * Returns the min zoom distance of the camera (default is 1)
     * @return minDistance
     */
    public float getMinDistance() {
        return minDistance;
    }

    /**
     * Sets the min zoom distance of the camera (default is 1)
     * @return minDistance
     */
    public void setMinDistance(float minDistance) {
        this.minDistance = minDistance;
    }    
    

    @Override
    public void udpate() {
        //Vector3f camPos = mTargetNode.getLocalTranslation().clone().addLocal( 0, mPosY, 0 );
        mJm3Camera.setRotation(mRotation);
        mJm3Camera.update();
        
        //float camMinHeight = environment.getHeight( mJm3Camera.getLocation() ) + 1;
        //if (!Float.isInfinite(camMinHeight) && !Float.isNaN(camMinHeight) && mJm3Camera.getLocation().y <= camMinHeight) {
        //    mJm3Camera.getLocation().y = camMinHeight;
        //    mJm3Camera.update();
        //}
        
    }
    
}
