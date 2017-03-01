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
package com.bigboots.gui;

//import java.util.Properties;


import com.bigboots.states.BBInGameState;
import com.bigboots.states.BBMainMenuState;
import com.bigboots.states.BBStateManager;
import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.controls.Controller;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.input.NiftyInputEvent;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.screen.ScreenController;
import de.lessvoid.xml.xpp3.Attributes;
import java.util.Properties;


/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBMainMenuController implements ScreenController, Controller{
    private Nifty mNifty;
    private Screen mScreen;

    public void bind(Nifty nifty, 
            Screen screen, 
            Element element, 
            Properties parameter, Attributes controlDefinitionAttributes){
        
        mNifty = nifty;
        mScreen = screen;
        
    }
            
    public void init(Properties parameter, Attributes controlDefinitionAttributes){
        
    }

    public void bind(Nifty nifty, Screen screen){
        mNifty = nifty;
    }

    public void onStartScreen(){
        
    }

    public void onEndScreen(){
        
    }

    public void onFocus(boolean getFocus){
        
    }

    public boolean inputEvent(NiftyInputEvent inputEvent){
        return true;
    }
    
       /** custom methods */ 
    public void startGame() {
        // switch to another screen
        mNifty.exit();
        
        //TODO : Next time use message notification to notify the change
        BBStateManager.getInstance().detach(BBStateManager.getInstance().getState(BBMainMenuState.class));
    
        //Change Game state
        BBInGameState state = new BBInGameState();
        //BBCreditState state = new BBCreditState();
        BBStateManager.getInstance().attach(state);
    }

    public void optionGame() {

    }
    
    public void quit() {
        System.out.println("******** Quit");
        BBStateManager.getInstance().getEngine().stop(false);
    }
}
