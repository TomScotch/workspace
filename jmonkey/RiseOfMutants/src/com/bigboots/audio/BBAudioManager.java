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
package com.bigboots.audio;


import com.bigboots.core.BBEngineSystem;
import com.bigboots.core.BBSettings;
import com.bigboots.core.BBUpdateListener;
import com.bigboots.core.BBUpdateManager;
import com.jme3.audio.AudioContext;
import com.jme3.audio.AudioRenderer;
import com.jme3.audio.Listener;
import com.jme3.system.JmeContext.Type;
import com.jme3.system.JmeSystem;
/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBAudioManager implements BBUpdateListener{
    private static BBAudioManager instance = new BBAudioManager();

    private BBAudioManager() {
    }
    
    public static BBAudioManager getInstance() { 
        return instance; 
    }
    
    protected AudioRenderer audioRenderer;
    private BBEngineSystem engineSystem;
    
    public void initAudio(BBEngineSystem eng){
        engineSystem = eng;
        
        if (BBSettings.getInstance().getSettings().getAudioRenderer() != null && engineSystem.getContext().getType() != Type.Headless){
            audioRenderer = JmeSystem.newAudioRenderer(BBSettings.getInstance().getSettings());
            audioRenderer.initialize();
            AudioContext.setAudioRenderer(audioRenderer);
        }
        
        BBUpdateManager.getInstance().register(this);
    }
    
    
    public void update(float tpf){
        // Make sure the audio renderer is available to callables
        AudioContext.setAudioRenderer(audioRenderer);

        if (audioRenderer != null){
            audioRenderer.update(tpf);
        }

    }
    
    /**
     * @return The {@link AudioRenderer audio renderer} for the application
     */
    public AudioRenderer getAudioRenderer() {
        return audioRenderer;
    }
    
    
    public void setListener(Listener lstr) {
        audioRenderer.setListener(lstr);
    }
    
    public void destroy(){
        if (audioRenderer != null){
            audioRenderer.cleanup();
        }
    }
    
}
