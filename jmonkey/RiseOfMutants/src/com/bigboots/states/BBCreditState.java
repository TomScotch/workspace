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
import com.bigboots.audio.BBAudioManager;
import com.bigboots.core.BBEngineSystem;
import com.bigboots.gui.BBGuiManager;
import com.bigboots.input.BBInputManager;
import com.jme3.input.KeyInput;
import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;
import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.screen.ScreenController;

import com.bigboots.core.BBSettings;
import com.bigboots.core.BBSceneManager;
import com.bigboots.physics.BBPhysicsManager;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.renderer.ViewPort;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBCreditState extends BBAbstractState implements ScreenController {
    private Nifty mNifty;
    private Camera cam;
    
    @Override
    public void initialize(BBEngineSystem engineSystem) {
        super.initialize(engineSystem);
     
        //Init input
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_EXIT, new KeyTrigger(KeyInput.KEY_ESCAPE));
        BBInputManager.getInstance().getInputManager().addListener(actionListener, BBGlobals.INPUT_MAPPING_EXIT);
        
        mNifty = BBGuiManager.getInstance().getNifty();
                
        BBInputManager.getInstance().getInputManager().setCursorVisible(true);
        
        //Load first scene and camera
        cam = new Camera(BBSettings.getInstance().getSettings().getWidth(), BBSettings.getInstance().getSettings().getHeight());
        cam.setFrustumPerspective(45f, (float)cam.getWidth() / cam.getHeight(), 1f, 1000f);
        cam.setLocation(new Vector3f(25f, 10f, 0f));
        cam.lookAt(new Vector3f(0f, 0f, 0f), Vector3f.UNIT_Y);
        
        
        ViewPort vp = engineSystem.getRenderManager().createMainView("TEST", cam);
        vp.setClearFlags(true, true, true);
        BBSceneManager.getInstance().setViewPort(vp);
        
        BBSceneManager.getInstance().setupBasicLight();
        BBSceneManager.getInstance().createSky();
        
        
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
        
        cam.clearViewportChanged();
        cam = null;
        BBAudioManager.getInstance().destroy();
        BBPhysicsManager.getInstance().destroy();
        
        this.engineSystem.getRenderManager().clearQueue(BBSceneManager.getInstance().getViewPort());              
         BBSceneManager.getInstance().destroy();
        this.engineSystem.getRenderManager().getRenderer().cleanup();
        this.engineSystem.getRenderManager().removeMainView("TEST"); 
        
    }
    
    public void bind(Nifty nifty, Screen screen){
        mNifty = nifty;
    }

    public void onStartScreen(){
        
    }

    public void onEndScreen(){
        
    }
    
   
    public void quitGame() {
        // switch to another screen
        //mNifty.gotoScreen("null");
        BBStateManager.getInstance().detach(this);
        //reset input
        BBInputManager.getInstance().getInputManager().removeListener(actionListener);
        BBInputManager.getInstance().getInputManager().clearMappings();
        BBInputManager.getInstance().resetInput(); 
        //Change Game state
         mNifty.gotoScreen("start");
        BBMainMenuState menu = new BBMainMenuState();
        BBStateManager.getInstance().attach(menu);
    }
    
    private AppActionListener actionListener = new AppActionListener();
    private class AppActionListener implements ActionListener {
      public void onAction(String name, boolean value, float tpf) {
          if (!value) {
              return;
          }

          if (name.equals(BBGlobals.INPUT_MAPPING_EXIT)) {
              mNifty.gotoScreen("credit");
              //engineSystem.stop(false);
          } 
      }
    }
}
