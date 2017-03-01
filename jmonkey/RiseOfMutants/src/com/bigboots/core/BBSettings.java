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
package com.bigboots.core;

import com.bigboots.BBGlobals;
import com.jme3.system.AppSettings;
import com.jme3.system.JmeContext;
import com.jme3.system.JmeSystem;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

/**
 *
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBSettings {
    private static BBSettings instance = new BBSettings();

    public static BBSettings getInstance() { 
        return instance; 
    }
    
    
    protected boolean showSettings = true;
    protected AppSettings settings;
    protected boolean loadFromRegistry = false;
    
    private BBSettings(){
        settings = new AppSettings(true);
        loadFromRegistry = true;
    }
    
    public void init(){

        //BBSettings.getInstance().getSettings().setSettingsDialogImage("/art/artworks/Characters/executioner.jpg");
        settings.setSettingsDialogImage("Interface/splash.jpg");
               
        // show settings dialog
        if (showSettings) {
            if (!JmeSystem.showSettingsDialog(settings, loadFromRegistry)) {
                return;
            }
        }
        
        try{
            BufferedImage[] icon = new BufferedImage []{
                ImageIO.read(BBSceneManager.getInstance().locateFile("Interface/BBRoM_32.png")),
                ImageIO.read(BBSceneManager.getInstance().locateFile("Interface/BBRoM_128.png"))
            };
            settings.setIcons(icon);
        }catch (Exception e) {
            e.printStackTrace();
        }
        //settings.setFrameRate(BBGlobals.SCENE_FPS);        
        settings.setTitle(BBGlobals.GAME_NAME+"_"+BBGlobals.GAME_VERSION);
        settings.setVSync(true);
        
    }
    
    public void showDialog(boolean val){
        showSettings = val;
    }
    
    public void loadFromContext(JmeContext contxt){
        settings = contxt.getSettings();
    }
    
    /**
     * Set the display settings to define the display created.
     * <p>
     * Examples of display parameters include display pixel width and height,
     * color bit depth, z-buffer bits, anti-aliasing samples, and update frequency.
     * If this method is called while the application is already running, then
     * {@link #restart() } must be called to apply the settings to the display.
     *
     * @param settings The settings to set.
     */
    public void setSettings(AppSettings settings){
        this.settings = settings;
 /*       if (context != null && settings.useInput() != inputEnabled){
            // may need to create or destroy input based
            // on settings change
            inputEnabled = !inputEnabled;
            if (inputEnabled){
                initInput();
            }else{
                destroyInput();
            }
        }else{
            inputEnabled = settings.useInput();
        }*/
    }
    
    public AppSettings getSettings(){
        return settings;
    }
    
    public boolean isUsed(){
        return settings.useInput();
    }
}
