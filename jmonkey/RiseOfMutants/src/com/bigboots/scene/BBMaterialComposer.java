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
import com.jme3.material.*;
import com.jme3.renderer.queue.RenderQueue.ShadowMode;
import com.jme3.scene.*;
import com.jme3.texture.Texture;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


/**
 *
 * @author mifth
 */
public class BBMaterialComposer {
    
    private AssetManager asset;
    private Node nodeMain;
    private ArrayList geometries;
    private JSONObject jsObj;
    private String modelPath;
    private FileReader fileRead;
    public BBMaterialComposer (Node node, AssetManager assetManager, String modelPATH) {

        asset = assetManager;    
        nodeMain = node;
        modelPath = modelPATH;
        
        geometries = new ArrayList();
                        System.out.println("Nodeee   " + node);
                        System.out.println("modelPATH   " + modelPATH);
                        
        getGeometries(nodeMain);

        // Load JSON script
        JSONParser json = new JSONParser();
        

         fileRead = null;
            try {
                fileRead = new FileReader(new File("assets/" + modelPath + ".json"));
            } catch (FileNotFoundException ex) {
                Logger.getLogger(BBMaterialComposer.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        try {
            jsObj = (JSONObject) json.parse(fileRead);
        } catch (IOException ex) {
            Logger.getLogger(BBMaterialComposer.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParseException ex) {
            Logger.getLogger(BBMaterialComposer.class.getName()).log(Level.SEVERE, null, ex);
        }
 
        setShader();
        
        jsObj.clear();
        
        try {
            fileRead.close();
        } catch (IOException ex) {
            Logger.getLogger(BBMaterialComposer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
   
    
    // Get all Geometries
    private void getGeometries(Node nodeMat) {

        Node ndMat = nodeMat;

        //Search for geometries        
        SceneGraphVisitor sgv = new SceneGraphVisitor() {

            public void visit(Spatial spatial) {
//                System.out.println(spatial + " Visited Spatial");
                if (spatial instanceof Geometry) {
                    Geometry geom_sc = (Geometry) spatial;
                    geometries.add(geom_sc);
          }
        }
     };

        ndMat.depthFirstTraversal(sgv);
        //  sc.breadthFirstTraversal(sgv);     
    }   
    
    private void setShader(){
    
    JSONObject jsonMat = (JSONObject) jsObj.get("Materials");
    
    for (Object geo : geometries.toArray()) {
     
        Geometry geom = (Geometry) geo;
        JSONObject jsonMatName = (JSONObject) jsonMat.get(geom.getName());    
        String jsonShaderName =  (String) jsonMatName.get("Shader");
        
        // set Shadows
        String shadowStr = (String) jsonMatName.get("Shadows");
        if (shadowStr != null && shadowStr.equals("Cast")) geom.setShadowMode(ShadowMode.Cast);
        else if (shadowStr != null && shadowStr.equals("Receive")) geom.setShadowMode(ShadowMode.Receive);
        else if (shadowStr != null && shadowStr.equals("Inherit")) geom.setShadowMode(ShadowMode.Inherit);
        else if (shadowStr != null && shadowStr.equals("CastAndReceive")) geom.setShadowMode(ShadowMode.CastAndReceive);
        
        // setLightBlow
        if (jsonShaderName.equals("LightBlow")) setLightBlow(jsonMatName, geom);
        
     }
        
    }
    
    private void setLightBlow(JSONObject material, Geometry geo){
    
        Geometry geomLB = geo;
        
        Material matNew = new Material(asset, "MatDefs/LightBlow/LightBlow.j3md");
        matNew.setName(geomLB.getMaterial().getName());
        geomLB.setMaterial(matNew);

        
    // DiffuseMap
    if (material.get("DiffuseMap") != null) {
        // Set Diffuse Map
        String strDif = (String) material.get("DiffuseMap");
        TextureKey tkDif = new TextureKey(strDif, false);
        tkDif.setAnisotropy(2);
        if (strDif.indexOf(".dds") < 0) tkDif.setGenerateMips(true);
        Texture diffuseTex = asset.loadTexture(tkDif);
 
        matNew.setTexture("DiffuseMap", diffuseTex);

        // set Wrap
        String checkWrap = (String) material.get("WrapMode");
        if (checkWrap != null && checkWrap.equals("Repeat")) diffuseTex.setWrap(Texture.WrapMode.Repeat);
        
        // set uv_Scale_0
        if (material.get("UV_Scale_0") != null) {
            String uv_scale_0 = (String) material.get("UV_Scale_0");            
            float f = Float.valueOf(uv_scale_0).floatValue();
            matNew.setFloat("uv_0_scale", f);
        }        
    }

     // NormalMap
    if (material.get("NormalMap") != null) {
        // Set Normal Map
        String strNor = (String) material.get("NormalMap");
        TextureKey tkNor = new TextureKey(strNor, false);
        tkNor.setAnisotropy(2);
        if (strNor.indexOf(".dds") < 0) tkNor.setGenerateMips(true);
        Texture normalTex = asset.loadTexture(tkNor);
       
        matNew.setTexture("NormalMap", normalTex);
        matNew.setBoolean("Nor_Inv_Y", true);        
        
        // set Wrap
        String checkWrap = (String) material.get("WrapMode");
        if (checkWrap != null && checkWrap.equals("Repeat")) normalTex.setWrap(Texture.WrapMode.Repeat);
    }   

    // Specular
    if (material.get("Specular") != null) {
        // Set Specular
        matNew.setBoolean("Specular_Lighting", true);
        String strSpec = (String) material.get("Specular");
        if (strSpec.equals("Dif") == true) matNew.setBoolean("Spec_A_Dif", true);
        else if (strSpec.equals("Nor") == true) matNew.setBoolean("Spec_A_Nor", true);     
    }
    
    // Emission
    if (material.get("Emission") != null) {
        // Set Specular
        if ((Boolean) material.get("Emission") == true)matNew.setBoolean("EmissiveMap", true);
    }    
    
    // DiffuseMap_1
    if (material.get("DiffuseMap_1") != null) {
        // Set Diffuse Map
        String strDif1 = (String) material.get("DiffuseMap_1");
        TextureKey tkDif = new TextureKey(strDif1, false);
        tkDif.setAnisotropy(2);
        if (strDif1.indexOf(".dds") < 0) tkDif.setGenerateMips(true);
        Texture diffuseTex = asset.loadTexture(tkDif);
        
        matNew.setTexture("DiffuseMap_1", diffuseTex);        
        
        // set Wrap
        String checkWrap = (String) material.get("WrapMode");
        if (checkWrap != null && checkWrap.equals("Repeat")) diffuseTex.setWrap(Texture.WrapMode.Repeat);
        
        // set uv_Scale_1
        if (material.get("UV_Scale_1") != null) {
            String uv_scale_1 = (String) material.get("UV_Scale_1");            
            float f = Float.valueOf(uv_scale_1).floatValue();
            matNew.setFloat("uv_1_scale", f);
        }      
    }

     // NormalMap_1
    if (material.get("NormalMap_1") != null) {
        // Set Normal Map
        String strNor1 = (String) material.get("NormalMap_1");
        TextureKey tkNor = new TextureKey(strNor1, false);
        tkNor.setAnisotropy(2);
        if (strNor1.indexOf(".dds") < 0) tkNor.setGenerateMips(true);
        Texture normalTex = asset.loadTexture(tkNor);

        matNew.setTexture("NormalMap_1", normalTex);
        matNew.setBoolean("Nor_Inv_Y", true);
        
        // set Wrap
        String checkWrap = (String) material.get("WrapMode");
        if (checkWrap != null && checkWrap.equals("Repeat")) normalTex.setWrap(Texture.WrapMode.Repeat);
        

    } 

    
    // TextureMask
    if (material.get("TextureMask") != null) {
        // Set Diffuse Map
        String strMask = (String) material.get("TextureMask");
        TextureKey tkTexMask = new TextureKey(strMask, false);
        tkTexMask.setAnisotropy(2);
        if (strMask.indexOf(".dds") < 0) tkTexMask.setGenerateMips(true);
        Texture diffuseTex = asset.loadTexture(tkTexMask);
        
        matNew.setBoolean("SeperateTexCoord", true);
        matNew.setTexture("TextureMask", diffuseTex);  
        
        
        // set Wrap
        String checkWrap = (String) material.get("WrapMode");
        if (checkWrap != null && checkWrap.equals("Repeat")) diffuseTex.setWrap(Texture.WrapMode.Repeat);
        

    }    
    

    // set LightMap
    if (material.get("LightMap") != null 
       || material.get("LightMap_R") != null
       || material.get("LightMap_G") != null
       || material.get("LightMap_B") != null) {
        // Set LightMap
        String lightmap = null;
        
        
        if(material.get("LightMap") != null) lightmap = (String) material.get("LightMap");
        else if(material.get("LightMap_R") != null) lightmap = (String) material.get("LightMap_R");
        else if(material.get("LightMap_G") != null) lightmap = (String) material.get("LightMap_G");
        else if(material.get("LightMap_B") != null) lightmap = (String) material.get("LightMap_B");
        
        TextureKey tkAO = new TextureKey(lightmap, false);
        tkAO.setAnisotropy(2);
        if (lightmap.indexOf(".dds") < 0) tkAO.setGenerateMips(true);
        Texture AOTex = asset.loadTexture(tkAO);
        
        // set a Texture and RGB channels
        matNew.setBoolean("SeperateTexCoord", true);
        matNew.setTexture("LightMap", AOTex);
        if(material.get("LightMap_R") != null) matNew.setBoolean("LightMap_R", true);
        else if(material.get("LightMap_G") != null) matNew.setBoolean("LightMap_G", true);
        else if(material.get("LightMap_B") != null) matNew.setBoolean("LightMap_B", true);          
        
        
        
        // set Wrap
        String checkWrap = (String) material.get("WrapMode");
        if (checkWrap != null && checkWrap.equals("Repeat")) AOTex.setWrap(Texture.WrapMode.Repeat);
        

    }    
  }

    
//        // Set Transparency
//        if (matName.indexOf("a") == 0) {
//            matThis.setBoolean("Alpha_A_Dif", true);
//            matThis.setFloat("AlphaDiscardThreshold", 0.01f);
//            matThis.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);
//           // geo.setQueueBucket(Bucket.Transparent);            
//        } else if (matName.indexOf("a") == 1) {
//            matThis.setBoolean("Alpha_A_Nor", true);
//            matThis.setFloat("AlphaDiscardThreshold", 0.01f);
//            matThis.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);
//           // geo.setQueueBucket(Bucket.Transparent);            
//        }


}
