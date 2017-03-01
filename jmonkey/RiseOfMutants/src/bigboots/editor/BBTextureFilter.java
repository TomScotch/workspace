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
package bigboots.editor;

import java.io.File;
import javax.swing.filechooser.*;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBTextureFilter extends FileFilter{
    //Accept j3o and ogre xml files.
    public boolean accept(File f) {
        if (f.isDirectory()) {
            return true;
        }
 
        String extension = getExtension(f);
        if (extension != null) {
            if (extension.equals("png") ||
                extension.equals("jpg") ||
                extension.equals("dds")){
                    return true;
            } else {
                return false;
            }
        }
 
        return false;
    }
 
    //The description of this filter
    public String getDescription() {
        return "Texture (*.png),(*.jpg), (*.dds)";
    }
    
    /*
     * Get the extension of a file.
     */
    private static String getExtension(File f) {
        String ext = null;
        String s = f.getName();
        int i = s.indexOf('.');
                //lastIndexOf('.');
 
        if (i > 0 &&  i < s.length() - 1) {
            ext = s.substring(i+1).toLowerCase();
        }
        return ext;
    }
}
