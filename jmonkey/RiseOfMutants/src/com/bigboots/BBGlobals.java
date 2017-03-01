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
package com.bigboots;


/**
 *
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBGlobals {
    public static final String GAME_VERSION = "0.0.1";
    public static final String GAME_NAME = "Rise Of Mutants";
    public static final String GAME_TYPE = "SCG"; //Side-Scrolling Game
    
    public static final int SCENE_FPS = 60;
    public static final float PHYSICS_TPT = 1f/60f; //Physic time pr. tick. Convention might require renaming.

    public static final boolean PHYSICS_THREADED = true; // Function not implemented.
    public static final boolean PHYSICS_DEBUG = false; // Function not implemented.
    
    public static final String INPUT_MAPPING_EXIT = "SIMPLEAPP_Exit";
    public static final String INPUT_MAPPING_CAMERA_POS = "SIMPLEAPP_CameraPos";
    public static final String INPUT_MAPPING_MEMORY = "SIMPLEAPP_Memory";
    public static final String INPUT_MAPPING_HIDE_STATS = "SIMPLEAPP_HideStats";
    
    public static final String INPUT_MAPPING_LEFT = "Left";
    public static final String INPUT_MAPPING_RIGHT = "Right";
    public static final String INPUT_MAPPING_UP = "Up";
    public static final String INPUT_MAPPING_DOWN = "Down";
    public static final String INPUT_MAPPING_JUMP = "Jump";
    public static final String INPUT_MAPPING_MLEFT = "MOUSE_LEFT";
    public static final String INPUT_MAPPING_DEBUG = "SHOW_DEBUG";
    public static final String INPUT_MAPPING_MRIGHT = "MOUSE_RIGHT";
    
    public enum ActionType {
        IDLE,
        ATTACK,
        BLOCK,
        JUMP,
        WALK,
        DIED
    }
}
