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
package com.bigboots.components;

import com.bigboots.core.BBSceneManager;
import com.jme3.audio.AudioData;
import com.jme3.audio.AudioKey;
import com.jme3.audio.AudioNode;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBAudioComponent extends AudioNode implements BBComponent{
    private String mSoundName = "";
    private boolean streamCache = false;
    protected boolean mEnabled = true;
    
    public BBAudioComponent(){
        super();
    }
    
    public BBAudioComponent(String name, boolean stream){
        super(BBSceneManager.getInstance().getAssetManager(), name, stream, false);
    }
    
    public void setSoundName(String name, boolean stream){
        mSoundName = name;
        this.audioKey = new AudioKey(name, stream, streamCache);
        this.data = (AudioData) BBSceneManager.getInstance().getAssetManager().loadAsset(audioKey);
    }
    public CompType getCompType(){
        return CompType.AUDIO;
    }
    
    public CompFamily getCompFamily(){
        return CompFamily.VISUAL;
    }
    
    public void destroy(){
        mSoundName = "";
        this.stop();
        this.detachAllChildren();
        this.removeFromParent();
        this.getWorldLightList().clear();
        this.getLocalLightList().clear();
    }
     
    public boolean isEnabled(){
        return mEnabled;
    }
    
    public void setEnable(boolean value){
        mEnabled = value;
    }
}
