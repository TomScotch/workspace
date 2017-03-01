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
public interface BBState {
       /**
     * Called to initialize the AppState.
     *
     * @param stateManager The state manager
     * @param app
     */
    public void initialize(BBEngineSystem engineSystem);

    /**
     * @return True if <code>initialize()</code> was called on the state,
     * false otherwise.
     */
    public boolean isInitialized();

    /**
     * Enable or disable the functionality of the <code>AppState</code>.
     * The effect of this call depends on implementation. An 
     * <code>AppState</code> starts as being enabled by default.
     * 
     * @param active activate the AppState or not.
     */
    public void setEnabled(boolean active);
    
    /**
     * @return True if the <code>AppState</code> is enabled, false otherwise.
     * 
     * @see AppState#setEnabled(boolean)
     */
    public boolean isEnabled();
    /**
     * Called when the state was attached.
     *
     * @param stateManager State manager to which the state was attached to.
     */
    public void stateAttached();

   /**
    * Called when the state was detached.
    *
    * @param stateManager The state manager from which the state was detached from.
    */
    public void stateDetached();

    /**
     * Called to update the state.
     *
     * @param tpf Time per frame.
     */
    public void update(float tpf);

    /**
     * Render the state.
     *
     * @param rm RenderManager
     */
    public void render(RenderManager rm);

    /**
     * Called after all rendering commands are flushed.
     */
    public void postRender();

    /**
     * Cleanup the game state. 
     */
    public void cleanup();

}
