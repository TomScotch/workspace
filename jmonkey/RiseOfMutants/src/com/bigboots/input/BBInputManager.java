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
package com.bigboots.input;

import com.bigboots.core.BBEngineSystem;
import com.bigboots.core.BBSettings;
import com.bigboots.core.BBUpdateListener;
import com.bigboots.core.BBUpdateManager;
import com.jme3.input.JoyInput;
import com.jme3.input.KeyInput;
import com.jme3.input.MouseInput;
import com.jme3.input.TouchInput;
import com.jme3.input.InputManager;
import com.jme3.input.controls.Trigger;
import com.jme3.system.JmeContext.Type;
import org.lwjgl.input.Mouse;

/**
 *
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBInputManager implements BBUpdateListener{
    private static BBInputManager instance = new BBInputManager();

    private BBInputManager() {
    }
    
    public static BBInputManager getInstance() { 
        return instance; 
    }
    
    protected MouseInput mouseInput;
    protected KeyInput keyInput;
    protected JoyInput joyInput;
    protected TouchInput touchInput;
    protected InputManager inputManager;
    
    protected boolean inputEnabled = true;
    protected BBEngineSystem myEng;
    

        
    public void init(BBEngineSystem eng){
        
        myEng = eng;
        
        //Check settings
        if (myEng.getContext() != null && BBSettings.getInstance().getSettings().useInput() != inputEnabled){
            // may need to create or destroy input based
            // on settings change
            inputEnabled = !inputEnabled;           
        }else{
            inputEnabled = BBSettings.getInstance().getSettings().useInput();
        }
        
        //init input
        mouseInput = myEng.getContext().getMouseInput();
        if (mouseInput != null){
            mouseInput.initialize();
        }
            

        keyInput = myEng.getContext().getKeyInput();
        if (keyInput != null)
            keyInput.initialize();
        
        touchInput = myEng.getContext().getTouchInput();
        if (touchInput != null)
            touchInput.initialize();

        if (!BBSettings.getInstance().getSettings().getBoolean("DisableJoysticks")){
            joyInput = myEng.getContext().getJoyInput();
            if (joyInput != null)
                joyInput.initialize();
        }

        inputManager = new InputManager(mouseInput, keyInput, joyInput, touchInput);
        
        if (myEng.getContext().getType() == Type.Display) {
            //inputManager.addMapping(BBGlobals.INPUT_MAPPING_EXIT, new KeyTrigger(KeyInput.KEY_ESCAPE));
        }

        BBUpdateManager.getInstance().register(this);
    }
    
    public void mapKey(String mappingName, Trigger... triggers){
        inputManager.addMapping(mappingName, triggers);
    }
    
    public void update(float tpf){
        
        if (inputEnabled){
            inputManager.update(tpf);
        }
    }

    public void destroyInput(){
        if (mouseInput != null)
            mouseInput.destroy();

        if (keyInput != null)
            keyInput.destroy();

        if (joyInput != null)
            joyInput.destroy();
        
        if (touchInput != null)
            touchInput.destroy();        

        inputManager = null;
    }
    
    /**
     * @return the {@link InputManager input manager}.
     */
    public InputManager getInputManager(){
        return inputManager;
    }
    
    public void setInputEnabled(boolean val){
        inputEnabled = val;
    }
    
    public boolean isInputEnabled(){
        return inputEnabled;
    }
    
    public void resetInput(){
        if (inputManager != null) {
            inputManager.reset();
        }
    }
    
    public void setMouseCenter(){
        if (myEng.getContext().getType() == Type.Display) {
            int x = BBSettings.getInstance().getSettings().getWidth() / 2;
            int y = BBSettings.getInstance().getSettings().getHeight() / 2;
            Mouse.setCursorPosition(x, y);
        }
        
    }
}
