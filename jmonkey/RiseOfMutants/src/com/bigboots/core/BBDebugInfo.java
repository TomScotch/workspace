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

import com.bigboots.gui.BBGuiManager;
import com.jme3.app.StatsView;
import com.jme3.font.BitmapFont;
import com.jme3.font.BitmapText;
import com.jme3.math.ColorRGBA;
import com.jme3.renderer.Renderer;
import com.jme3.scene.Spatial.CullHint;
/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBDebugInfo {
    private static BBDebugInfo instance = new BBDebugInfo();

    private BBDebugInfo() {
    }
    
    public static BBDebugInfo getInstance() { 
        return instance; 
    }
    

    protected BitmapText fpsText;
    protected BitmapFont guiFont;
    protected StatsView statsView;
    protected boolean showStat = false;
    private  boolean showFps = false;
    protected float secondCounter = 0.0f;
    protected int frameCounter = 0;
    
    
    public void init(Renderer renderer){
        this.loadFPSText();
        this.loadStatsView(renderer);
        this.setDisplayFps(showFps);
        this.setDisplayStatView(showStat);
    }
    /**
     * Attaches FPS statistics to guiNode and displays it on the screen.
     *
     */
    public void loadFPSText() {
        guiFont = BBSceneManager.getInstance().getAssetManager().loadFont("Interface/Fonts/Default.fnt");
        fpsText = new BitmapText(guiFont, false);
        fpsText.setLocalTranslation(0, fpsText.getLineHeight(), 0);
        fpsText.setText("Frames per second");
        fpsText.setColor(ColorRGBA.White);
        BBGuiManager.getInstance().getGuiNode().attachChild(fpsText);
    }
    
    /**
     * Attaches Statistics View to guiNode and displays it on the screen
     * above FPS statistics line.
     *
     */
    public void loadStatsView(Renderer renderer) {
        statsView = new StatsView("Statistics View", BBSceneManager.getInstance().getAssetManager(), renderer.getStatistics());
        //move it up so it appears above fps text
        statsView.setLocalTranslation(0, fpsText.getLineHeight(), 0);
        BBGuiManager.getInstance().getGuiNode().attachChild(statsView);

    }
    
    public void update(float tpf) {
        if (showFps) {
            secondCounter += tpf;
            frameCounter ++;
            if (secondCounter >= 1.0f) {
                int fps = (int) (frameCounter / secondCounter);
                fpsText.setText("Frames per second: " + fps);
                //System.out.println("***FPS : "+ fps);
                secondCounter = 0.0f;
                frameCounter = 0;
            }          
        }
    }
    
    public boolean isShowFPS(){
        return showFps;
    }
    public boolean isShowStat(){
        return showStat;
    }
    
    public void setDisplayFps(boolean show) {
        showFps = show;
        fpsText.setCullHint(show ? CullHint.Never : CullHint.Always);
    }
    
    public void setDisplayStatView(boolean show) {
        showStat = show;
        statsView.setEnabled(show);
        statsView.setCullHint(show ? CullHint.Never : CullHint.Always);
    }
}
