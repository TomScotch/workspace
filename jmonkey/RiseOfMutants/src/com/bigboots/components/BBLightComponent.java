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

import com.jme3.light.*;



/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBLightComponent implements BBComponent{
    
    private Light mLight;
    protected boolean mEnabled = true;
    
    public BBLightComponent(){
        
    }
    
    public void setLightType(Light.Type ltype){
        switch (ltype) {
            case Directional :
                mLight = new DirectionalLight();
            break;
            case Point :
                mLight = new PointLight();
            break;
            case Spot :
                mLight = new SpotLight();
            break;
            case Ambient :
                mLight = new AmbientLight();
            break;
            default: 
                throw new RuntimeException("None or unsupported Light Type");
        }
    }
    
    public <T extends Light>T getLight(){
        if(mLight.getType() == Light.Type.Directional){
            return (T) getLight(DirectionalLight.class);
        }
        if(mLight.getType() == Light.Type.Point){
            return (T) getLight(PointLight.class);
        }
        if(mLight.getType() == Light.Type.Spot){
            return (T) getLight(SpotLight.class);
        }
        if(mLight.getType() == Light.Type.Ambient){
            return (T) getLight(AmbientLight.class);
        }
        return null;
    }
    
    public <T extends Light>T getLight(Class<T> name){
        if(name.equals(DirectionalLight.class) || 
                name.equals(PointLight.class)|| 
                name.equals(SpotLight.class)|| 
                name.equals(AmbientLight.class)){
            
            return (T)mLight;
        }
        return null;
    }
    
    public CompType getCompType(){
        return CompType.LIGHT;
    }
    
    public CompFamily getCompFamily(){
        return CompFamily.VISUAL;
    }
    
    public boolean isEnabled(){
        return mEnabled;
    }
    
    public void setEnable(boolean value){
        mEnabled = value;
    }
}
