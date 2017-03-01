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

import com.bigboots.components.BBAudioComponent;
import com.bigboots.components.BBComponent;
import com.jme3.effect.ParticleEmitter;
import com.jme3.effect.ParticleMesh.Type;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public abstract class BBParticleEmitter extends ParticleEmitter implements BBComponent{
    protected BBAudioComponent fxSound;
    protected int COUNT_FACTOR = 1;
    protected float COUNT_FACTOR_F = 1f;
    
    public enum FxType {
        NONE,
        EXPLOSION,
        FIRE
    }
    
    public BBParticleEmitter(){
        super();
    }
    
    public BBParticleEmitter(String name, Type type, int numParticles){
        super(name, type, numParticles);
    }
    
    public void setFxSound(BBAudioComponent sound){
        fxSound = sound;
    }
    
    public BBAudioComponent getFxSound(){
        return fxSound;
    }

    public abstract void startEmitFX();
    
    public abstract void stopEmitFX();
    
    public abstract void destroy();
    
    public CompType getCompType() {
        return CompType.PARTICLE;
    }

    public CompFamily getCompFamily() {
        return CompFamily.VISUAL;
    }
    
    @Override
    public boolean isEnabled(){
        return super.isEnabled();
    }
    
    @Override
    public void setEnable(boolean value){
        super.setEnabled(value);
    }
}
