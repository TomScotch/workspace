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
package com.bigboots.core;

import java.util.ArrayList;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBUpdateManager {
    private static BBUpdateManager instance = new BBUpdateManager();

    private BBUpdateManager() {
    }
    
    public static BBUpdateManager getInstance() { 
        return instance; 
    }
    
    
    private final ArrayList<BBUpdateListener> updateList = new ArrayList<BBUpdateListener>();
    
    public void register(BBUpdateListener listener){
        synchronized (updateList){
            if (!updateList.contains(listener)){
                updateList.add(listener);
            }
        }
    }
    
    public void update(float tpf){
        for (int i = 0; i < updateList.size(); i++) {
            updateList.get(i).update(tpf);
        }
     }
    
}
