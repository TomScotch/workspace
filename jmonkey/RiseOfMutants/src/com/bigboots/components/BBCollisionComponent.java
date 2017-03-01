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

import com.jme3.bullet.collision.shapes.CollisionShape;


/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBCollisionComponent implements BBComponent{
    
    public enum ShapeType {
        NONE,
        CAPSULE,
        BOX,
        CYLINDER,
        HULL,
        MESH,
        PLANE,
        SPHERE,
        CONE,
        COMPLEX
    }
    
    private ShapeType mType;
    private CollisionShape mSpecificShape;
    protected boolean mEnabled = true;
    
    public BBCollisionComponent(){
        //super();
        mType = ShapeType.NONE;
    }
    
    public void attachShape(CollisionShape shp){
        mSpecificShape = shp;
    }
    
    public CollisionShape getShape(){
        return mSpecificShape;
    }
    public CompType getCompType(){
        return CompType.COLSHAPE;
    }
    
    public CompFamily getCompFamily(){
        return CompFamily.PHYSICS;
    }
    
    public ShapeType getShapeType () {
        return mType;
    }   
    
    public void setShapeType (ShapeType newType) {
        mType = newType;
    }    
    
    public boolean isEnabled(){
        return mEnabled;
    }
    
    public void setEnable(boolean value){
        mEnabled = value;
    }
}
