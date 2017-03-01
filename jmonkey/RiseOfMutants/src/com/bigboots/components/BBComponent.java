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


/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public interface BBComponent {
    /**
     * The type of the Component.
     */
    public enum CompType {
        NONE,
        NODE,
        LIGHT,
        MESH,
        AUDIO,
        LISTENER,
        ANIMATION,
        CONTROLLER,
        COLSHAPE,
        CAMERA,
        PARTICLE
    }
    
    /**
     * The Family of the Component.
     */
    public enum CompFamily {
        NONE,
        VISUAL,
        AI,
        AUDIBLE,
        PHYSICS
    }
    
    
    /**
     * @return If enabled
     * @see BBCameraComponent#setEnabled(boolean)
     */
    public boolean isEnabled();
    
    public void setEnable(boolean value);
    
    public CompType getCompType();
    
    public CompFamily getCompFamily();
}
