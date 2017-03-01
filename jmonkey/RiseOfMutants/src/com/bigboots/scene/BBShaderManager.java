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
package com.bigboots.scene;


import com.jme3.asset.AssetManager;
import com.jme3.asset.TextureKey;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.scene.Geometry;
import com.jme3.scene.Node;
import com.jme3.scene.SceneGraphVisitor;
import com.jme3.scene.Spatial;
import com.jme3.texture.Texture;

/**
 *
 * @author mifth
 */
public class BBShaderManager {
    
    private AssetManager assetman;
    private Node nodeShader;

   public BBShaderManager (Node node, AssetManager assetm) {
       
        nodeShader = node;
        assetman = assetm;
    }
    
    // set Fog
    public void setFogParam (ColorRGBA fogColor, String FogTexture) {
    
    final ColorRGBA colFog = fogColor;    
    final String PathFog = FogTexture;     
    SceneGraphVisitor sgvFog = new SceneGraphVisitor() {

    public void visit(Spatial spatial) {
     boolean check = true;
     
     //System.out.println(spatial + " Visited Shader Geometry");
        if (spatial instanceof Geometry) {
         Geometry geo = (Geometry) spatial;
//         Material mat = geo.getMaterial();
//         String matName = geo.getMaterial().getName();
         String matShaderName = geo.getMaterial().getMaterialDef().getName();
         
         if (matShaderName.equals("LightBlow") && colFog != null) {

            geo.getMaterial().setColor("FogColor", colFog);              
         }
         else if (matShaderName.equals("LightBlow") && PathFog != null) {
//             if (matName != null && matName.indexOf("-geom-") >= 0) check = false;
//             else check = true;
            TextureKey tkk = new TextureKey(PathFog, check);
//            tkk.setAnisotropy(2);
            tkk.setAsCube(true);            
            tkk.setGenerateMips(true);
            Texture ibl = assetman.loadTexture(tkk);
            geo.getMaterial().setTexture("FogSkyBox", ibl);              
         }         
        }
      }
    };    
    nodeShader.depthFirstTraversal(sgvFog);
    }

    
    // set IBL
  public void setIBLParam (String IBLTexturePath) {
    
    final String PathIBL = IBLTexturePath;    
    SceneGraphVisitor sgvIBL = new SceneGraphVisitor() {

    public void visit(Spatial spatial) {
     boolean check = true;
          
     //System.out.println(spatial + " Visited Shader Geometry");
        if (spatial instanceof Geometry) {
         Geometry geo = (Geometry) spatial;
//         Material mat = geo.getMaterial();
//         String matName = geo.getMaterial().getName();
         String matShaderName = geo.getMaterial().getMaterialDef().getName();
         
         if (matShaderName.equals("LightBlow")) {
//             if (matName != null && matName.indexOf("-geom-") >= 0) check = false;
//             else check = true;
            TextureKey tkk = new TextureKey(PathIBL, check);
        //    tkk.setAnisotropy(2);
            tkk.setAsCube(true);
            tkk.setGenerateMips(false);
            Texture ibl = assetman.loadTexture(tkk);
            geo.getMaterial().setTexture("IblMap", ibl);              
         }
         
        }
      }
    }; 
    nodeShader.depthFirstTraversal(sgvIBL);
    
    }    

  // set simple IBL
  public void setSimpleIBLParam (String IBLTexturePath) {
    
    final String PathSIBL = IBLTexturePath;    
    SceneGraphVisitor sgvSIBL = new SceneGraphVisitor() {

    public void visit(Spatial spatial) {
     boolean check = false;
     
     //System.out.println(spatial + " Visited Shader Geometry");
        if (spatial instanceof Geometry) {
         Geometry geo = (Geometry) spatial;
//         Material mat = geo.getMaterial();
//         String matName = geo.getMaterial().getName();
         String matShaderName = geo.getMaterial().getMaterialDef().getName();
         
         if (matShaderName.equals("LightBlow")) {
//             if (matName != null && matName.indexOf("-geom-") >= 0) check = false;
//             else check = true;
            TextureKey tkk = new TextureKey(PathSIBL, check);
            tkk.setAsCube(false);
     //       tkk.setAnisotropy(2);
     //       tkk.setGenerateMips(true);
            Texture ibl = assetman.loadTexture(tkk);
            geo.getMaterial().setTexture("IblMap_Simple", ibl);              
         }
         
        }
      }
    };    
    nodeShader.depthFirstTraversal(sgvSIBL);
    }    
  
  /// still under development  
  public void setReflectionParam (String ReflectionPath) {
    final String PathRef = ReflectionPath;
    SceneGraphVisitor sgvRef = new SceneGraphVisitor() {

    public void visit(Spatial spatial) {
     boolean check = true;   
     //System.out.println(spatial + " Visited Shader Geometry");
        if (spatial instanceof Geometry) {
         Geometry geo = (Geometry) spatial;
//         Material mat = geo.getMaterial();
//         String matName = geo.getMaterial().getName();
         String matShaderName = geo.getMaterial().getMaterialDef().getName();

         if (matShaderName.equals("LightBlow")) {
//             if (matName != null && matName.indexOf("-geom-") >= 0) check = false;
//             else check = true;
            TextureKey tkk = new TextureKey(PathRef, check);
//            tkk.setAnisotropy(2);
            tkk.setAsCube(true);
            tkk.setGenerateMips(true);
            Texture ref = assetman.loadTexture(tkk);
            geo.getMaterial().setTexture("RefMap", ref);              
         }         
        }
        
      }
    };    
    nodeShader.depthFirstTraversal(sgvRef);
    }    
 

}
