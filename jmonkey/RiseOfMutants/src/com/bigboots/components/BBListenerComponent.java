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

import com.jme3.audio.Listener;
/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBListenerComponent extends Listener implements BBComponent{
    protected boolean mEnabled = true;
    
    public BBListenerComponent(){
        super();
    }
    /**
     * @return The {@link Listener listener} object for audio
     */
    public BBListenerComponent(Listener source){
        super(source);
    }
    
    public CompType getCompType(){
        return CompType.LISTENER;
    }
    
    public CompFamily getCompFamily(){
        return CompFamily.AUDIBLE;
    }
    
    public void destroy(){
        
    }
    
    public boolean isEnabled(){
        return mEnabled;
    }
    
    public void setEnable(boolean value){
        mEnabled = value;
    }
}
