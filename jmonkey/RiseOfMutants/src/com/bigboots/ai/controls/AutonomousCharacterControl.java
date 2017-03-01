/*
 * Copyright (c) 2009-2011 jMonkeyEngine
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * * Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 *
 * * Neither the name of 'jMonkeyEngine' nor the names of its contributors
 *   may be used to endorse or promote products derived from this software
 *   without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.bigboots.ai.controls;

import com.jme3.bullet.control.CharacterControl;
import com.jme3.export.JmeExporter;
import com.jme3.export.JmeImporter;
import com.jme3.math.Vector3f;
import com.bigboots.BBGlobals;
import com.jme3.network.Client;
import com.jme3.renderer.RenderManager;
import com.jme3.renderer.ViewPort;
import com.jme3.scene.Spatial;
import com.jme3.scene.control.Control;
import java.io.IOException;

/**
 * Automomous character control, implements the AutonomousControl interface and
 * controls a character if available on the spatial.
 * @author normenhansen
 * @author Vemund Kvam
 */
public class AutonomousCharacterControl implements AutonomousControl {
    private long entityId;
    private float checkRadius = 2;
//    private float speed = 10f * BBGlobals.PHYSICS_TPT;
    private Vector3f targetLocation = new Vector3f();
    private Vector3f vector = new Vector3f();
    private Vector3f vector2 = new Vector3f();
    private boolean moving = false;
    private CharacterControl characterControl;
    private Vector3f aimDirection = new Vector3f(Vector3f.UNIT_Z);
    
    private Vector3f lastMoveToLocation = new Vector3f();
    private Vector3f lastAimDirection = new Vector3f();
    protected boolean enabled = true;
    protected Spatial spatial;
    
    public AutonomousCharacterControl() {
    }

    public AutonomousCharacterControl(long entityId) {
        this.entityId = entityId;
    }
    
    public void aimAt(Vector3f direction) {
            if (!lastAimDirection.equals(direction)) {
                lastAimDirection.set(direction);
            }
    }


    public void moveTo(Vector3f location) {
        if (!lastMoveToLocation.equals(location)) {
        lastMoveToLocation.set(location);
        }
    }
    

    public void doAimAt(Vector3f direction) {
        aimDirection.set(direction);
//        characterControl.setViewDirection(direction);
    }

    public Vector3f getAimDirection() {
        return aimDirection;
    }

    public void doMoveTo(Vector3f location) {
        targetLocation.set(location);
        characterControl.getPhysicsLocation(vector);
        vector2.set(targetLocation);
        vector2.subtractLocal(vector);
        float distance = vector2.length();
        if (distance > checkRadius) {
            moving = true;
        }
    }

    
    public void doPerformAction(String action, boolean activate) {
        if (activate && action.equals(action)) {
            characterControl.jump();
        }
    }

    public void performAction(int action, boolean activate) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    
    public void setSpatial(Spatial spatial) {
        this.spatial = spatial;
        if (spatial == null) {
            return;
        }
        NavigationControl navControl = spatial.getControl(NavigationControl.class);
        if (navControl != null) {
            checkRadius = navControl.getEntityRadius();
        }
        Float spatialSpeed = (Float) spatial.getUserData("Speed");
        if (spatialSpeed != null) {
//            speed = spatialSpeed * BBGlobals.PHYSICS_TPT;
        }
        characterControl = spatial.getControl(CharacterControl.class);
    }

    
    public boolean isMoving() {
        return moving;
    }


    public Vector3f getTargetLocation() {
        return targetLocation;
    }


    public Vector3f getLocation() {
        return characterControl.getPhysicsLocation(vector);
    }


    public void update(float tpf) {
        if (!moving || !enabled) {
            return;
        }
        characterControl.getPhysicsLocation(vector);
        vector2.set(targetLocation);
        vector2.subtractLocal(vector);
        float distance = vector2.length();
        if (distance <= checkRadius) {
            moving = false;
            characterControl.setWalkDirection(Vector3f.ZERO);
        } else {
            vector2.y = 0;
            vector2.normalizeLocal();
            characterControl.setViewDirection(vector2);
//            vector2.multLocal(speed);
            characterControl.setWalkDirection(vector2);
        }
    }

    public void render(RenderManager rm, ViewPort vp) {
    }

    public Control cloneForSpatial(Spatial spatial) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setEnabled(boolean enabled) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public boolean isEnabled() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void write(JmeExporter ex) throws IOException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void read(JmeImporter im) throws IOException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}
