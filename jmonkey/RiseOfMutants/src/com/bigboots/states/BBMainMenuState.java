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

import com.bigboots.BBGlobals;
import com.bigboots.components.BBAudioComponent;
import com.bigboots.core.BBEngineSystem;
import com.bigboots.gui.BBGuiManager;
import com.bigboots.input.BBInputManager;
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBMainMenuState extends BBAbstractState {
    //music
    private BBAudioComponent music;
    
    @Override
    public void initialize(BBEngineSystem eng) {
        super.initialize(eng);
     
        //Init input
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_EXIT, new KeyTrigger(KeyInput.KEY_ESCAPE));
        BBInputManager.getInstance().getInputManager().addListener(actionListener, BBGlobals.INPUT_MAPPING_EXIT);

        BBGuiManager.getInstance().getNifty().gotoScreen("start");
        
        BBInputManager.getInstance().getInputManager().setCursorVisible(true);
        
        //init global music
        music = new BBAudioComponent("Sounds/mainmenu.ogg", false);
        music.setVolume(0.1f);
        music.setLooping(true);
        music.play();
    }
    
    @Override
    public void update(float tpf) {
        super.update(tpf);
    
    }
    @Override
    public void stateAttached() {
        super.stateAttached();
        
    }

    @Override
    public void stateDetached() {
        super.stateDetached();

        music.destroy();
        music = null;        
        //reset input : Just remove the listener as the reset input cause input issue
        BBInputManager.getInstance().getInputManager().clearMappings(); 
        BBInputManager.getInstance().getInputManager().removeListener(actionListener);
     
    }
       
    private AppActionListener actionListener = new AppActionListener();
    private class AppActionListener implements ActionListener {
      public void onAction(String name, boolean value, float tpf) {
          if (!value) {
              return;
          }

          if (name.equals(BBGlobals.INPUT_MAPPING_EXIT)) {
              engineSystem.stop(false);
          } 
      }
    }
}
