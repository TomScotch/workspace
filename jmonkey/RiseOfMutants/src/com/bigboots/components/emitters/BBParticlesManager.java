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
package com.bigboots.components.emitters;


import com.bigboots.components.emitters.BBParticleEmitter.FxType;
import java.util.HashMap;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBParticlesManager {
    private static BBParticlesManager instance = new BBParticlesManager();

    private BBParticlesManager() {
    }
    
    public static BBParticlesManager getInstance() { 
        return instance; 
    }
    
    private HashMap<String, BBParticleEmitter> mapParticlesFx = new HashMap<String, BBParticleEmitter>();
    
    
    public void init(){
        //TODO : add  all standard particles to be use in game
        
        //create explosion ParticleFx
        BBExplosionFx expFx = new BBExplosionFx("FLAME");
        expFx.init();
        mapParticlesFx.put("FLAME", expFx);
    }
    
    public void createParticleFx(String name, FxType type){
        if(type.equals(FxType.EXPLOSION)){
            BBExplosionFx expFx = new BBExplosionFx("FLAME");
            expFx.init();
            mapParticlesFx.put("FLAME", expFx);
        }
    }
    
    public BBParticleEmitter getParticleFx(String name){
        return mapParticlesFx.get(name);
    }
    
    public void removeParticleFx(String name){
        mapParticlesFx.remove(name);
    }
    
    public void removeParticleFx(BBParticleEmitter emit){
        if(this.getParticleFx(emit.getName()) != null){
            mapParticlesFx.remove(emit.getName());
        }else{
            //TODO : Raise an exception here
        }
        
    }
    
    public void destroy(){
        mapParticlesFx.clear();
    }
    
}
