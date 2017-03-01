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
import com.jme3.util.SafeArrayList;
import java.util.Arrays;
import java.util.List;


/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBStateManager {
    private static BBStateManager instance = new BBStateManager();

    private BBStateManager() {       
    }
    
    public static BBStateManager getInstance() { 
        return instance; 
    }
    /**
     *  List holding the attached app states that are pending
     *  initialization.  Once initialized they will be added to
     *  the running app states.  
     */
    private final SafeArrayList<BBState> initializing = new SafeArrayList<BBState>(BBState.class);
    
    /**
     *  Holds the active states once they are initialized.  
     */
    private final SafeArrayList<BBState> states = new SafeArrayList<BBState>(BBState.class);
    
    /**
     *  List holding the detached app states that are pending
     *  cleanup.  
     */
    private final SafeArrayList<BBState> terminating = new SafeArrayList<BBState>(BBState.class);
 
    // All of the above lists need to be thread safe but access will be
    // synchronized separately.... but always on the states list.  This
    // is to avoid deadlocking that may occur and the most common use case
    // is that they are all modified from the same thread anyway.
    
    private BBState[] stateArray;
    private BBEngineSystem engineSystem;

    public BBEngineSystem getEngine(){
        return engineSystem;
    }
    
    protected BBState[] getInitializing() { 
        synchronized (states){
            return initializing.getArray();
        }
    } 

    protected BBState[] getTerminating() { 
        synchronized (states){
            return terminating.getArray();
        }
    } 

    protected BBState[] getStates(){
        synchronized (states){
            return states.getArray();
        }
    }

    public void init(BBEngineSystem engine){
        engineSystem = engine;   
    }
    
    /**
     * Attach a state to the AppStateManager, the same state cannot be attached
     * twice.
     *
     * @param state The state to attach
     * @return True if the state was successfully attached, false if the state
     * was already attached.
     */
    public boolean attach(BBState state){
        synchronized (states){
            if (!states.contains(state) && !initializing.contains(state)){
                state.stateAttached();
                initializing.add(state);
                return true;
            }else{
                return false;
            }
        }
    }

    /**
     * Detaches the state from the AppStateManager. 
     *
     * @param state The state to detach
     * @return True if the state was detached successfully, false
     * if the state was not attached in the first place.
     */
    public boolean detach(BBState state){
        synchronized (states){
            if (states.contains(state)){
                state.stateDetached();
                states.remove(state);
                terminating.add(state);
                return true;
            } else if(initializing.contains(state)){
                state.stateDetached();
                initializing.remove(state);
                return true;
            }else{
                return false;
            }
        }
    }

    /**
     * Check if a state is attached or not.
     *
     * @param state The state to check
     * @return True if the state is currently attached to this AppStateManager.
     * 
     * @see AppStateManager#attach(com.jme3.app.state.AppState)
     */
    public boolean hasState(BBState state){
        synchronized (states){
            return states.contains(state) || initializing.contains(state);
        }
    }

    /**
     * Returns the first state that is an instance of subclass of the specified class.
     * @param <T>
     * @param stateClass
     * @return First attached state that is an instance of stateClass
     */
    public <T extends BBState> T getState(Class<T> stateClass){
        synchronized (states){
            BBState[] array = getStates();
            for (BBState state : array) {
                if (stateClass.isAssignableFrom(state.getClass())){
                    return (T) state;
                }
            }
            
            // This may be more trouble than its worth but I think
            // it's necessary for proper decoupling of states and provides
            // similar behavior to before where a state could be looked
            // up even if it wasn't initialized. -pspeed
            array = getInitializing();
            for (BBState state : array) {
                if (stateClass.isAssignableFrom(state.getClass())){
                    return (T) state;
                }
            }
        }
        return null;
    }

    protected void initializePending(){
        BBState[] array = getInitializing();
        synchronized( states ) {
            // Move the states that will be initialized
            // into the active array.  In all but one case the
            // order doesn't matter but if we do this here then
            // a state can detach itself in initialize().  If we
            // did it after then it couldn't.
            List<BBState> transfer = Arrays.asList(array);         
            states.addAll(transfer);
            initializing.removeAll(transfer);
        }        
        for (BBState state : array) {
            state.initialize(engineSystem);
        }
    }
    
    protected void terminatePending(){
        BBState[] array = getTerminating();
        for (BBState state : array) {
            state.cleanup();
        }        
        synchronized( states ) {
            // Remove just the states that were terminated...
            // which might now be a subset of the total terminating
            // list.
            terminating.removeAll(Arrays.asList(array));         
        }
    }    

    /**
     * Calls update for attached states, do not call directly.
     * @param tpf Time per frame.
     */
    public void update(float tpf){
                  
        // Cleanup any states pending
        terminatePending();

        // Initialize any states pending
        initializePending();

        // Update enabled states    
        BBState[] array = getStates();
        for (BBState state : array){
            if (state.isEnabled()) {
                state.update(tpf);
            }
        }
    }

    /**
     * Calls render for all attached and initialized states, do not call directly.
     * @param rm The RenderManager
     */
    public void render(RenderManager rm){
        BBState[] array = getStates();
        for (BBState state : array){
            if (state.isEnabled()) {
                state.render(rm);
            }
        }
    }

    /**
     * Calls render for all attached and initialized states, do not call directly.
     */
    public void postRender(){
        BBState[] array = getStates();
        for (BBState state : array){
            if (state.isEnabled()) {
                state.postRender();
            }
        }
    }

    /**
     * Calls cleanup on attached states, do not call directly.
     */
    public void cleanup(){
        BBState[] array = getStates();
        for (BBState state : array){
            state.cleanup();
        }
    }       
}
