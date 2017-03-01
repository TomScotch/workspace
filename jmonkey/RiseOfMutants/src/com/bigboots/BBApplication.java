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
package com.bigboots;

import com.bigboots.audio.BBAudioManager;
import com.bigboots.core.BBDebugInfo;
import com.bigboots.core.BBEngineSystem;
import com.bigboots.core.BBSceneManager;
import com.bigboots.core.BBSettings;
import com.bigboots.core.BBUpdateManager;
import com.bigboots.gui.BBGuiManager;
import com.bigboots.input.BBInputManager;
import com.bigboots.states.BBStateManager;
import com.jme3.system.AppSettings;
import com.jme3.system.SystemListener;



/**
 *
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBApplication implements SystemListener {
        
    protected BBEngineSystem engineSystem;
    protected float mSpeed = 1f;
    protected boolean inputEnabled = true;
    
    public BBApplication(){
        
        BBSettings.getInstance();
        engineSystem = new BBEngineSystem();
    }
    
    /*
     * Main game loop for standard App
     */
    public void run(){
        //set up scene by initializing rootnode
        BBSceneManager.getInstance().init();
        
        //init application settings to display the config dialog
        BBSettings.getInstance().init();
        
        engineSystem.create();
        engineSystem.setContextListener(this);
    }
     
    
    /*
     * Main entry point for canvas App
     */
    public void initCanvas(){
        //set up scene by initializing rootnode
        BBSceneManager.getInstance().init();
        
        //init application settings to display the config dialog
        BBSettings.getInstance().init();
        
        engineSystem.createCanvas();
        engineSystem.setContextListener(this);
    }    
    
    /**
     * Callback to indicate the application to initialize. This method
     * is called in the GL/Rendering thread so any GL-dependent resources
     * can be initialized.
     */
    public void initialize(){
       
        BBUpdateManager.getInstance();  
        //init timer and render
        engineSystem.initialize();
        //State
        BBStateManager.getInstance().init(engineSystem);
        
        // aquire settings config from the context
        BBSettings.getInstance().loadFromContext(engineSystem.getContext());
        
        //init input and listener
        BBInputManager.getInstance().init(engineSystem);
        //init gui
        BBGuiManager.getInstance().init(engineSystem);
        //init Audio
        BBAudioManager.getInstance().initAudio(engineSystem);
        //Init Debug info
        BBDebugInfo.getInstance().init(engineSystem.getRenderer());
        
        this.simpleInitialize();
  
    }
    
    /*
     * Specific funtion to let the subclass to set up custum initilisation
     */
    public void simpleInitialize(){
        
    }

    /**
     * Callback to update the application state, and render the scene
     * to the back buffer.
     */
    public void update(){
 
        System.nanoTime();
        
        if (mSpeed == 0 || this.engineSystem.isSystemPause())
            return;
        
        engineSystem.getTimer().update();
        
        float tpf = engineSystem.getTimer().getTimePerFrame() * mSpeed;
        //update all updater : rootnode, input, etc
        BBUpdateManager.getInstance().update(tpf);
        //update all states
        BBStateManager.getInstance().update(tpf);

        //Custom udpate 
        this.simpleUpdate();
        //Update RootNode
        BBSceneManager.getInstance().update(tpf);       
        //Set render
        BBStateManager.getInstance().render(engineSystem.getRenderManager());
        //update state of the scene graph after rootNode.updateGeometricState() call
        engineSystem.update(tpf);       
        //Update post render
        BBStateManager.getInstance().postRender();      
        //Display stats
        BBDebugInfo.getInstance().update(tpf);
      
    }
    /*
     * Specific update funtion for the subclass custom update 
     */
    public void simpleUpdate(){
        
    }
    
    /**
     * Called to notify the application that the resolution has changed.
     * @param width
     * @param height
     */
    public void reshape(int width, int height){
        engineSystem.reshape(width, height);
    }


    /**
     * Called when the user requests to close the application. This
     * could happen when he clicks the X button on the window, presses
     * the Alt-F4 combination, attempts to shutdown the process from 
     * the task manager, or presses ESC. 
     * @param esc If true, the user pressed ESC to close the application.
     */
    public void requestClose(boolean esc){
        engineSystem.requestClose(esc);
    }

    /**
     * Called when the application gained focus. The display
     * implementation is not allowed to call this method before
     * initialize() has been called or after destroy() has been called.
     */
    public void gainFocus(){
        //autoflush the frame
        engineSystem.gainFocus();
        //Reset Input
        BBInputManager.getInstance().resetInput();
    }

    /**
     * Called when the application lost focus. The display
     * implementation is not allowed to call this method before
     * initialize() has been called or after destroy() has been called.
     */
    public void loseFocus(){
        engineSystem.loseFocus();
    }

    /**
     * Called when an error has occured. This is typically
     * invoked when an uncought exception is thrown in the render thread.
     * @param errorMsg The error message, if any, or null.
     * @param t Throwable object, or null.
     */
    public void handleError(String errorMsg, Throwable t){
        engineSystem.handleError(errorMsg, t);
    }

    /**
     * Callback to indicate that the context has been destroyed (either
     * by the user or requested by the application itself). Typically
     * cleanup of native resources should happen here. This method is called
     * in the GL/Rendering thread.
     */
    public void destroy(){
        BBInputManager.getInstance().destroyInput();
        BBStateManager.getInstance().cleanup();
        engineSystem.destroy();
    }
    
    public BBEngineSystem getEngine(){
        return engineSystem;
    }
    
    public void setNewSettings(AppSettings settings){
        BBSettings.getInstance().setSettings(settings);
    }
    
}
