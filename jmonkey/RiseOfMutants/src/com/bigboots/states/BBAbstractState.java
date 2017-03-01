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
package com.bigboots.states;

import com.bigboots.core.BBEngineSystem;
import com.jme3.renderer.RenderManager;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBAbstractState implements BBState{

    /**
     * <code>initialized</code> is set to true when the method
     * {@link AbstractAppState#initialize(com.jme3.app.state.AppStateManager, com.jme3.app.Application) }
     * is called. When {@link AbstractAppState#cleanup() } is called, <code>initialized</code>
     * is set back to false.
     */
    protected boolean initialized = false;
    private boolean enabled = true;
    protected BBEngineSystem engineSystem;
    
    public void initialize(BBEngineSystem eng) {
        initialized = true;
        engineSystem = eng;
    }

    public boolean isInitialized() {
        return initialized;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public boolean isEnabled() {
        return enabled;
    }

    public void stateAttached() {
    }

    public void stateDetached() {
    }

    public void update(float tpf) {
    }

    public void render(RenderManager rm) {
    }

    public void postRender(){
    }

    public void cleanup() {
        initialized = false;
    }
    
}
