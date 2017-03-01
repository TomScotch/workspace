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

import com.jme3.collision.MotionAllowedListener;
import com.jme3.math.*;
import com.jme3.renderer.Camera;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBFreeCamera extends BBCameraComponent{
    
    protected Vector3f initialUpVec;
    protected float rotationSpeed = 1f;
    protected float moveSpeed = 3f;
    protected MotionAllowedListener motionAllowed = null;
    protected boolean dragToRotate = false;
    protected boolean canRotate = false;
    
    
    public BBFreeCamera(String name, Camera cam){
        super(name, cam);
        mCameraMode = CamMode.FPS;
        initialUpVec = cam.getUp().clone();
    }
    
    
    /**
     * @return If drag to rotate feature is enabled.
     *
     * @see FlyByCamera#setDragToRotate(boolean) 
     */
    public boolean isDragToRotate() {
        return dragToRotate;
    }

    /**
     * Set if drag to rotate mode is enabled.
     * 
     * When true, the user must hold the mouse button
     * and drag over the screen to rotate the camera, and the cursor is
     * visible until dragged. Otherwise, the cursor is invisible at all times
     * and holding the mouse button is not needed to rotate the camera.
     * This feature is disabled by default.
     * 
     * @param dragToRotate True if drag to rotate mode is enabled.
     */
    public void setDragToRotate(boolean dragToRotate) {
        this.dragToRotate = dragToRotate;
    }
    
    /**
     * Sets the up vector that should be used for the camera.
     * @param upVec
     */
    public void setUpVector(Vector3f upVec) {
       initialUpVec.set(upVec);
    }
    
    public Vector3f getUpVector() {
       return initialUpVec;
    }
    
    public void setMotionAllowedListener(MotionAllowedListener listener){
        this.motionAllowed = listener;
    }
    
    /**
     * Sets the move speed. The speed is given in world units per second.
     * @param moveSpeed
     */
    public void setMoveSpeed(float moveSpeed){
        this.moveSpeed = moveSpeed;
    }

    /**
     * Sets the rotation speed.
     * @param rotationSpeed
     */
    public void setRotationSpeed(float rotationSpeed){
        this.rotationSpeed = rotationSpeed;
    }
    
    
    public void rotateCamera(float value, Vector3f axis){
        if (dragToRotate){
            if (canRotate){
//                value = -value;
            }else{
                return;
            }
        }

        Matrix3f mat = new Matrix3f();
        mat.fromAngleNormalAxis(rotationSpeed * value, axis);

        Vector3f up = mJm3Camera.getUp();
        Vector3f left = mJm3Camera.getLeft();
        Vector3f dir = mJm3Camera.getDirection();

        mat.mult(up, up);
        mat.mult(left, left);
        mat.mult(dir, dir);

        Quaternion q = new Quaternion();
        q.fromAxes(left, up, dir);
        q.normalizeLocal();

        mJm3Camera.setAxes(q);
    }

    public void zoomCamera(float value){
        // derive fovY value
        float h = mJm3Camera.getFrustumTop();
        float w = mJm3Camera.getFrustumRight();
        float aspect = w / h;

        float near = mJm3Camera.getFrustumNear();

        float fovY = FastMath.atan(h / near)
                  / (FastMath.DEG_TO_RAD * .5f);
        fovY += value * 0.1f;

        h = FastMath.tan( fovY * FastMath.DEG_TO_RAD * .5f) * near;
        w = h * aspect;

        mJm3Camera.setFrustumTop(h);
        mJm3Camera.setFrustumBottom(-h);
        mJm3Camera.setFrustumLeft(-w);
        mJm3Camera.setFrustumRight(w);
    }

    public void riseCamera(float value){
        Vector3f vel = new Vector3f(0, value * moveSpeed, 0);
        Vector3f pos = mJm3Camera.getLocation().clone();

        if (motionAllowed != null)
            motionAllowed.checkMotionAllowed(pos, vel);
        else
            pos.addLocal(vel);

        mJm3Camera.setLocation(pos);
    }

    public void moveCamera(float value, boolean sideways){
        Vector3f vel = new Vector3f();
        Vector3f pos = mJm3Camera.getLocation().clone();

        if (sideways){
            mJm3Camera.getLeft(vel);
        }else{
            mJm3Camera.getDirection(vel);
        }
        vel.multLocal(value * moveSpeed);

        if (motionAllowed != null)
            motionAllowed.checkMotionAllowed(pos, vel);
        else
            pos.addLocal(vel);

        mJm3Camera.setLocation(pos);
    }

    @Override
    public void udpate() {
        
    }
}
