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


import com.bigboots.BBWorldManager;
import com.bigboots.components.BBCollisionComponent;
import com.bigboots.components.BBCollisionComponent.ShapeType;
import com.bigboots.components.BBComponent.CompType;
import com.bigboots.components.BBEntity;
import com.bigboots.components.BBNodeComponent;
import com.bigboots.physics.BBPhysicsManager;
import com.jme3.asset.AssetManager;
import com.jme3.bullet.collision.shapes.CollisionShape;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.math.Quaternion;
import com.jme3.math.Transform;
import com.jme3.scene.*;
import java.util.ArrayList;


/**
 *
 * @author mifth
 */
public class BBSceneComposer {

    private AssetManager assett;
    private Node sceneNode;    
    private String pathDir;


    public  BBSceneComposer (Node scene, AssetManager assetM) {
        

        assett = assetM;
        sceneNode = scene;
        pathDir = "J3O/";

        startCompose();
          
    }


    private void startCompose() {
                 
        
        // Creating Entities
       for (Spatial sp : sceneNode.getChildren()) {
           Node ndEnt = (Node) sp;
           String str = ndEnt.getName();
           if (str.indexOf(".") > 0) str = str.substring(0, str.indexOf("."));
           
           // Load j3o Model
           Node loadedNode = loadModelNow(pathDir + "Models/" + str  + ".j3o");
//           FixedTangentBinormalGenerator.generate(loadedNode);
           loadedNode.setLocalTransform(ndEnt.getLocalTransform());
           loadedNode.setName(ndEnt.getName());
           
           //Create an Entity from an existing node
           BBEntity mEntity = new BBEntity(loadedNode.getName(), loadedNode);
           
           //Add a transform component to attach it to the scene graph
           BBNodeComponent pnode = mEntity.addComponent(CompType.NODE);

           //Load it in the way to attach Geometry to the entity node
           mEntity.loadModel("");

           // Fixing some coordinates
           mEntity.getComponent(BBNodeComponent.class).setLocalTransform(mEntity.getComponent(BBNodeComponent.class).getChild(0).getWorldTransform());
           mEntity.getComponent(BBNodeComponent.class).getChild(0).setLocalTransform(new Transform());

           
          
           BBWorldManager.getInstance().addEntity(mEntity);
           //System.out.println("Entity Created " + ndColSearch.getName());
           
           // Searching for collision meshes
             if (loadedNode.getUserData("PhysicsCollision") != null) {
                 
               String conName = loadedNode.getUserData("PhysicsCollision").toString();


                   
                   ShapeType shType = null;
                   if (conName.indexOf("CAPSULE") == 0) shType = ShapeType.CAPSULE;
                   else if (conName.indexOf("BOX") == 0) shType = ShapeType.BOX;
                   else if (conName.indexOf("CYLINDER") == 0) shType = ShapeType.CYLINDER;
                   else if (conName.indexOf("HULL") == 0) shType = ShapeType.HULL;
                   else if (conName.indexOf("MESH") == 0) shType = ShapeType.MESH;
                   else if (conName.indexOf("PLANE") == 0) shType = ShapeType.PLANE;
                   else if (conName.indexOf("SPHERE") == 0) shType = ShapeType.SPHERE;
                   else if (conName.indexOf("CONE") == 0) shType = ShapeType.CONE;
                   else if (conName.indexOf("COMPLEX") == 0) shType = ShapeType.COMPLEX;
                   
                   
                    // Creating Collision Mesh
                    Node ndCol = loadModelNow(pathDir + "CollisionMeshes/" + conName + ".j3o");
                    ndCol.setLocalRotation(new Quaternion());
                    CollisionShape colShape = BBPhysicsManager.getInstance().createPhysicShape(shType, ndCol, 1, 1);                   
                    colShape.setScale(mEntity.getComponent(BBNodeComponent.class).getLocalScale());
                    RigidBodyControl worldPhysics = new RigidBodyControl(colShape,0);

                    // Setting ShapeType of the Entity
                    mEntity.addComponent(CompType.COLSHAPE);
                    mEntity.getComponent(BBCollisionComponent.class).setShapeType(shType);
                    //mEntity.getComponent(BBCollisionComponent.class).attachShape(colShape);
                    
                    pnode.addControl(worldPhysics);
                    BBPhysicsManager.getInstance().getPhysicsSpace().add(mEntity.getComponent(BBNodeComponent.class)); 
              }
         
           //Attach it to the RootNode
           mEntity.attachToRoot(); 
       }
     }
   
    
    
    private Node loadModelNow (String Path){
 
        // Load a file. 
        Node nd =  (Node) assett.loadModel(Path);               
    
        return nd;
    }    
    
}