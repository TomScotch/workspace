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
import com.bigboots.core.BBSceneManager;
import com.jme3.effect.ParticleMesh.Type;
import com.jme3.effect.shapes.EmitterSphereShape;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBExplosionFx extends BBParticleEmitter{
    public BBExplosionFx(String name){
        super(name, Type.Triangle, 32);
    }
    
    public void init(){
        this.setSelectRandomImage(true);
        this.setStartColor(new ColorRGBA(1f, 0.4f, 0.05f, (float) (1f / COUNT_FACTOR_F)));
        this.setEndColor(new ColorRGBA(.4f, .22f, .12f, 0f));
        this.setStartSize(1.3f);
        this.setEndSize(2f);
        this.setShape(new EmitterSphereShape(Vector3f.ZERO, 1f));
        this.setParticlesPerSec(0);
        this.setGravity(0, -5f, 0);
        this.setLowLife(.4f);
        this.setHighLife(.5f);
        this.setImagesX(2);
        this.setImagesY(2);
        Material fxMaterial = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Particle.j3md");
        fxMaterial.setTexture("Texture", BBSceneManager.getInstance().getAssetManager().loadTexture("Effects/Explosion/flame.png"));
        fxMaterial.setReceivesShadows(false);
        this.setMaterial(fxMaterial);
        this.setEnabled(false);
        
        fxSound = new BBAudioComponent();
        fxSound.setSoundName("Sounds/explosionLarge2.ogg", false);
        fxSound.setLooping(false);
        fxSound.setVolume(0.6f);
    }

    @Override
    public void startEmitFX() {
        this.emitAllParticles();
        fxSound.play();
    }

    @Override
    public void stopEmitFX() {
        this.setEnabled(false);
        if(fxSound != null){
            fxSound.stop();
        }
    }

    @Override
    public void destroy() {
        this.stopEmitFX();
        this.killAllParticles();
        this.removeFromParent();
//        BBSceneManager.getInstance().getRootNode().detachChild(this);
        if(fxSound != null){
            fxSound.destroy();
            fxSound = null;
        }
    }
    
}
