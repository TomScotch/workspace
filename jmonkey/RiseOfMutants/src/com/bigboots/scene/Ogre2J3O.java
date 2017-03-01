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
import com.jme3.asset.DesktopAssetManager;
import com.jme3.asset.ModelKey;
import com.jme3.asset.plugins.FileLocator;
import com.jme3.export.binary.BinaryExporter;
import com.jme3.math.Transform;
import com.jme3.scene.AssetLinkNode;
import com.jme3.scene.Geometry;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.util.TangentBinormalGenerator;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author mifth
 */
public class Ogre2J3O {

    private AssetManager assett;
    private Node sceneNode;
    private String ScenePath, sceneNAME;
    private ArrayList sceneEntities, CollisionMeshes, modelEntities;
    private boolean composeEnt;

    public Ogre2J3O(Node scene, String sceneName, String scenePath, AssetManager assetM, boolean composeEntities) {

        sceneNAME = sceneName;
        ScenePath = scenePath;
        assett = assetM;
        sceneNode = scene;
        composeEnt = composeEntities;

        modelEntities = new ArrayList();
        sceneEntities = new ArrayList();
        CollisionMeshes = new ArrayList();

        

        
        startCompose();

        modelEntities.clear();
        sceneEntities.clear();
        CollisionMeshes.clear();

    }

    private void startCompose() {

        
        // Clear Nodes
        clearNodes(sceneNode);
        
                
        // Search for Original Objects
        for (Spatial originSearch : sceneNode.getChildren()) {
            if (originSearch instanceof Node) {
                
                Node ndSearch = (Node) originSearch;
                String str = ndSearch.getName();
                if (str.indexOf(".") > 0) str = str.substring(0, str.indexOf("."));

                
                // Scene Entities
                if (str.indexOf("E") != 0 && str.indexOf("CAPSULE") != 0 && str.indexOf("BOX") != 0
                        && str.indexOf("CYLINDER") != 0 && str.indexOf("HULL") != 0 && str.indexOf("MESH") != 0
                        && str.indexOf("PLANE") != 0 && str.indexOf("SPHERE") != 0 && str.indexOf("CONE") != 0
                        && str.indexOf("COMPLEX") != 0) {

                    boolean exists = false;
                    
                    if (sceneEntities.isEmpty() == false) {
                    for (Object ob : sceneEntities.toArray()){
                        Node nd = (Node) ob;
                        if (nd.getName().equals(str)) exists = true;
                     }
                    }
                    if (exists == false) loadSceneMesh(str, "sceneEnt"); // Load models made in a scene
                } 
                
                
                // Entities
                else if (str.indexOf("E") == 0 && composeEnt == true && str.indexOf("CAPSULE") != 0 && str.indexOf("BOX") != 0
                        && str.indexOf("CYLINDER") != 0 && str.indexOf("HULL") != 0 && str.indexOf("MESH") != 0
                        && str.indexOf("PLANE") != 0 && str.indexOf("SPHERE") != 0 && str.indexOf("CONE") != 0
                        && str.indexOf("COMPLEX") != 0) {
                    
                    boolean exists2 = false;

                    if (modelEntities.isEmpty() == false) {
                    for (Object ob : modelEntities.toArray()){
                        Node nd = (Node) ob;
                        if (nd.getName().equals(str)) exists2 = true;
                     }  
                    }
                    if (exists2 == false) loadSceneMesh(str, "modelEnt");
                } 
                
                // Collision Meshes
                else if (str.indexOf("CAPSULE") == 0 || str.indexOf("BOX") == 0
                        || str.indexOf("CYLINDER") == 0 || str.indexOf("HULL") == 0 || str.indexOf("MESH") == 0
                        || str.indexOf("PLANE") == 0 || str.indexOf("SPHERE") == 0 || str.indexOf("CONE") == 0
                        || str.indexOf("COMPLEX") == 0) {
                    
                    boolean exists3 = false;
                    
                    if (CollisionMeshes.isEmpty() == false) {
                    for (Object ob : CollisionMeshes.toArray()){
                        Node nd = (Node) ob;
                        if (nd.getName().equals(str)) exists3 = true;
                     }
                    }
                    if (exists3 == false) loadSceneMesh(str, "Collision");
                }
            }
        }
        //System.out.println("====================================================");



        // Searching for collision meshes for Scene Entities
        for (Object sp : sceneEntities.toArray()) {
            Node ndColSearch = (Node) sp;

            for (Object sp2 : CollisionMeshes.toArray()) {
                Node ndCol = (Node) sp2;
                if (ndCol.getName().endsWith(ndColSearch.getName())) {


                    if (ndCol.getName().indexOf("CAPSULE") == 0 || ndCol.getName().indexOf("BOX") == 0
                            || ndCol.getName().indexOf("CYLINDER") == 0 || ndCol.getName().indexOf("HULL") == 0 || ndCol.getName().indexOf("MESH") == 0
                            || ndCol.getName().indexOf("PLANE") == 0 || ndCol.getName().indexOf("SPHERE") == 0 || ndCol.getName().indexOf("CONE") == 0
                            || ndCol.getName().indexOf("COMPLEX") == 0) {
                        ndColSearch.setUserData("PhysicsCollision", ndCol.getName());
                    }
                }
            }
        }

        // Searching for collision meshes for Entities
        for (Object sp : modelEntities.toArray()) {
            Node ndColSearch = (Node) sp;

            for (Object sp2 : CollisionMeshes.toArray()) {
                Node ndCol = (Node) sp2;
                if (ndCol.getName().endsWith(ndColSearch.getName())) {


                    if (ndCol.getName().indexOf("CAPSULE") == 0 || ndCol.getName().indexOf("BOX") == 0
                            || ndCol.getName().indexOf("CYLINDER") == 0 || ndCol.getName().indexOf("HULL") == 0 || ndCol.getName().indexOf("MESH") == 0
                            || ndCol.getName().indexOf("PLANE") == 0 || ndCol.getName().indexOf("SPHERE") == 0 || ndCol.getName().indexOf("CONE") == 0
                            || ndCol.getName().indexOf("COMPLEX") == 0) {
                        ndColSearch.setUserData("PhysicsCollision", ndCol.getName());
                    }
                }
            }
        }
        
        
        

        // Saving scene with empty Nodes to j3o
        Node sceneSave = new Node(sceneNAME);

        for (Object sp : sceneNode.getChildren()) {
            Node ndGet = (Node) sp;
            if (ndGet.getName().indexOf("CAPSULE") != 0 && ndGet.getName().indexOf("BOX") != 0
                    && ndGet.getName().indexOf("CYLINDER") != 0 && ndGet.getName().indexOf("HULL") != 0 && ndGet.getName().indexOf("MESH") != 0
                    && ndGet.getName().indexOf("PLANE") != 0 && ndGet.getName().indexOf("SPHERE") != 0 && ndGet.getName().indexOf("CONE") != 0
                    && ndGet.getName().indexOf("COMPLEX") != 0) {
                Node ndSave = new Node(ndGet.getName());
                ndSave.setLocalTransform(ndGet.getLocalTransform());
                sceneSave.attachChild(ndSave);
            }
        }
        binaryExport("J3O/Scenes/" + sceneSave.getName(), sceneSave);
        

        // Saving scene Entities
   
        for (Object sp : sceneEntities) {
            Node ndSave = (Node) sp;
            ndSave.removeFromParent();
            ndSave.setLocalTransform(new Transform());
            binaryExport("J3O/Models/" + ndSave.getName(), ndSave);
        }
        
        // Saving Entities
        if(composeEnt == true){    
        for (Object sp : modelEntities) {
            Node ndSave = (Node) sp;
            ndSave.removeFromParent();
            ndSave.setLocalTransform(new Transform());
            binaryExport("J3O/Models/" + ndSave.getName(), ndSave);
        }
        }
        
        
        // Saving collision Meshes
        for (Object sp : CollisionMeshes) {
            Node ndSave = (Node) sp;
            ndSave.removeFromParent();
            ndSave.setLocalTransform(new Transform());
            binaryExport("J3O/CollisionMeshes/" + ndSave.getName(), ndSave);
        }
        
    }

    
        // Clear Nodes from unused stuff        
        private void clearNodes(Node nodeClear){

        for (Spatial nodeSearch : nodeClear.getChildren()) {
            if (nodeSearch instanceof Node) {
                Node node = (Node) nodeSearch;
                node.detachAllChildren();
            }
        }
            
        
        // Saving scene with linked Nodes to j3o (for scene viewing)
        Node sceneSaveView = new Node(sceneNAME);

        for (Object sp : sceneNode.getChildren()) {
            Node ndGet = (Node) sp;
            if (ndGet.getName().indexOf("CAPSULE") != 0 && ndGet.getName().indexOf("BOX") != 0
                    && ndGet.getName().indexOf("CYLINDER") != 0 && ndGet.getName().indexOf("HULL") != 0 && ndGet.getName().indexOf("MESH") != 0
                    && ndGet.getName().indexOf("PLANE") != 0 && ndGet.getName().indexOf("SPHERE") != 0 && ndGet.getName().indexOf("CONE") != 0
                    && ndGet.getName().indexOf("COMPLEX") != 0) {
                
                String str = ndGet.getName();
                if (str.indexOf(".") > 0) str.substring(0, str.indexOf("."));
                
                ModelKey mkLinkToScene = new ModelKey("J3O/Models/" + str + ".j3o");
                AssetLinkNode ndSave = new AssetLinkNode(mkLinkToScene);
                ndSave.setName(ndGet.getName());
                ndSave.setLocalTransform(ndGet.getLocalTransform());
                sceneSaveView.attachChild(ndSave);
            }
        }
        binaryExport("J3O/Scenes/" + sceneSaveView.getName() + "_preview", sceneSaveView);
        
      }
        
        
    
    private void binaryExport(String name, Node saveNode) {

        String str = new String("assets/" + name + ".j3o");

        // convert to / for windows
        if (File.separatorChar == '\\') {
            str = str.replace('\\', '/');
        }
        if (!str.endsWith("/")) {
            str += "/";
        }

        File MaFile = new File(str);
        MaFile.setWritable(true);
        MaFile.canWrite();
        MaFile.canRead();


        try {
            BinaryExporter exporter = BinaryExporter.getInstance();
            exporter.save(saveNode, MaFile);
//            BinaryExporter.getInstance().save(saveNode, MaFile);
        } catch (IOException ex) {
            System.out.println("Baddddd Saveee");

        }

    }

    
    // Load Entity
    private void loadSceneMesh(String entNode, String isEntity) {


        
       // Scene Mesh 
       if (isEntity.equals("sceneEnt")) {

        // Register file locator for the AssetManager
        assett.registerLocator("blsets", FileLocator.class);
        
        // Load a Mesh. 
        DesktopAssetManager dskMesh = (DesktopAssetManager) assett;  
        ModelKey mKey = new ModelKey(ScenePath + "/ogre/" + entNode + ".mesh.xml");
        Node ndMesh =  (Node) dskMesh.loadModel(mKey); 
        
        // Clear loaded file
        dskMesh.clearCache();  
        assett.unregisterLocator("blsets", FileLocator.class);
        
        BBMaterialComposer composer = new BBMaterialComposer(ndMesh, assett, "Scripts/Scenes/" + sceneNAME);
        
        TangentBinormalGenerator.generate(ndMesh);
        ndMesh.setName(entNode);
        sceneEntities.add(ndMesh);
       } 
       
       
       // Entity Mesh
       else if (isEntity.equals("modelEnt")) {
        // Load JSON script
        JSONParser json = new JSONParser();
        
         FileReader fileRead = null;
         
            try {
                fileRead = new FileReader(new File("assets/Scripts/Entities/List/GameEntities_01.json"));
            } catch (FileNotFoundException ex) {
                Logger.getLogger(BBMaterialComposer.class.getName()).log(Level.SEVERE, null, ex);
            }
            
            try {
                JSONObject jsObj = (JSONObject) json.parse(fileRead);

                // Register file locator for the AssetManager
                assett.registerLocator("blsets", FileLocator.class);
        
                // Load a Entity. 
                DesktopAssetManager dskMesh = (DesktopAssetManager) assett;  
                ModelKey sceneKey = new ModelKey((String) jsObj.get(entNode) + "/" + entNode + ".scene");
                Node ndEntity =  (Node) dskMesh.loadModel(sceneKey); 
                ndEntity.setName(entNode);
                clearNodes(ndEntity);
                
                for (Spatial sp : ndEntity.getChildren()) {
                    
                    Node ndTemp = (Node) sp;
                    String str4 = sp.getName();
                    if (str4.indexOf(".") > 0) str4 = str4.substring(0, str4.indexOf("."));
                    
                    // Load a Mesh. 
                    DesktopAssetManager dsk = (DesktopAssetManager) assett;  
                    ModelKey modKey = new ModelKey((String) jsObj.get(entNode) + "/ogre/" + str4 + ".mesh.xml");
                    Node ndMesh =  (Node) dsk.loadModel(modKey);     
                    
                    
                    if (str4.indexOf("CAPSULE") == 0 || str4.indexOf("BOX") == 0
                    || str4.indexOf("CYLINDER") == 0 || str4.indexOf("HULL") == 0 || str4.indexOf("MESH") == 0
                    || str4.indexOf("PLANE") == 0 || str4.indexOf("SPHERE") == 0 || str4.indexOf("CONE") == 0
                    || str4.indexOf("COMPLEX") == 0) {                    
                    CollisionMeshes.add(ndMesh);
                    ndMesh.setName(str4);
                    ndMesh.removeFromParent();
                    } 
                    else {
                        ndMesh.setLocalTransform(ndTemp.getLocalTransform());
                        ndMesh.setName(ndTemp.getName());
                        ndTemp.removeFromParent();
                        ndEntity.attachChild(ndMesh);
                    }
                    
                // Clear cache file
                dsk.clearCache();                      
                
                BBMaterialComposer composer = new BBMaterialComposer(ndEntity, assett, "Scripts/Entities/" + entNode);
                TangentBinormalGenerator.generate(ndEntity);
                modelEntities.add(ndEntity);                    
                }
                
                

                
                // Clear loaded file
                dskMesh.clearCache();  
                assett.unregisterLocator("blsets", FileLocator.class);                
                
                
                
            } catch (IOException ex) {
                Logger.getLogger(Ogre2J3O.class.getName()).log(Level.SEVERE, null, ex);
            } catch (org.json.simple.parser.ParseException ex) {
                Logger.getLogger(Ogre2J3O.class.getName()).log(Level.SEVERE, null, ex);
            }
            
            
           try {
               fileRead.close();
           } catch (IOException ex) {
             Logger.getLogger(BBMaterialComposer.class.getName()).log(Level.SEVERE, null, ex);
         }
        
       } 
       
       // Entity Mesh
       else if (isEntity.equals("Collision")) {
           
        // Register file locator for the AssetManager
        assett.registerLocator("blsets", FileLocator.class);
        
        // Load a Mesh. 
        DesktopAssetManager dskMesh = (DesktopAssetManager) assett;  
        ModelKey mKey = new ModelKey(ScenePath + "/ogre/" + entNode + ".mesh.xml");
        Node colMesh =  (Node) dskMesh.loadModel(mKey); 
        
        CollisionMeshes.add(colMesh);
        colMesh.setName(entNode);
        
        // Clear loaded file
        dskMesh.clearCache();  
        assett.unregisterLocator("blsets", FileLocator.class);
        

    }
       
       }       
      }


