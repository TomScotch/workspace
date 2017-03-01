/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bigboots;


import com.bigboots.ai.controls.AutonomousControl;
import com.bigboots.ai.controls.CommandControl;
import com.bigboots.ai.controls.MovementControl;
import com.bigboots.ai.util.NavMeshGenerator;
import com.bigboots.ai.navmesh.NavMesh;
import com.bigboots.ai.triggers.TriggerControl;
import com.bigboots.components.BBEntity;
import com.bigboots.components.BBNodeComponent;
import com.bigboots.core.BBSceneManager;
import com.bigboots.physics.BBPhysicsManager;


import com.jme3.asset.AssetManager;
import com.jme3.bullet.collision.PhysicsCollisionObject;
import com.jme3.bullet.collision.PhysicsRayTestResult;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.bullet.control.VehicleControl;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.math.Vector3f;
import com.jme3.scene.Geometry;
import com.jme3.scene.Mesh;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.scene.control.Control;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map.Entry;
import java.util.logging.Level;
import java.util.logging.Logger;
import jme3tools.optimize.GeometryBatchFactory;
/**
 * 
 * @author Ulrich Nzuzi <ulrichnz@code.google.com>
 * @author Vemund Kvam <vekjeft@code.google.com>
 * 
 * A temporary accessor for information needed by many functions in game.
 * Mostly copy paste from MonkeyZone, but Network functions has been removed.
 * Will most like needed a thorough review.
 */
public class BBWorldManager  {
    private static BBWorldManager instance = new BBWorldManager();
    
    private BBWorldManager() {
        
    }
    
    public static BBWorldManager getInstance() { 
        return instance; 
    }
    
    
    private HashMap<String, BBEntity> entities = new HashMap<String, BBEntity>();
    private NavMesh navMesh = new NavMesh();
    private Node worldRoot = new Node("WORLD");
    private AssetManager assetManager;
    private NavMeshGenerator generator = new NavMeshGenerator();
    private List<Control> userControls = new LinkedList<Control>();
    private int newId;

    
    public void init(){
        this.assetManager = BBSceneManager.getInstance().getAssetManager();
        BBSceneManager.getInstance().addChild(worldRoot); 
    }
    
    /**
     * gets the entity with the specified id
     * @param id
     * @return
     */
    public BBEntity getEntity(String id) {
        return entities.get(id);
    }

    /**
     * gets the entity belonging to a PhysicsCollisionObject
     * @param object
     * @return
     */
    public BBEntity getEntity(PhysicsCollisionObject object) {
        Object obj = object.getUserObject();
        if (obj instanceof Spatial) {
            Spatial spatial = (Spatial) obj;
            return getEntity(spatial.getName());
        }
        return null;
    }

    /**
     * finds the entity id of a given spatial if there is one
     * @param entity
     * @return
     */
    public String getEntityId(BBEntity entity) {
        for (Iterator<Entry<String, BBEntity>> it = entities.entrySet().iterator(); it.hasNext();) {
            Entry<String, BBEntity> entry = it.next();
            if (entry.getValue() == entity) {
                return entry.getKey();
            }
        }
        return null;
    }

    /**
     * gets the entity belonging to a PhysicsCollisionObject
     * @param object
     * @return
     *
    public String getEntityId(PhysicsCollisionObject object) {
        Object obj = object.getUserObject();
        if (obj instanceof Spatial) {
            Spatial spatial = (Spatial) obj;
            if (spatial != null) {
                return getEntityId(spatial.getName());
            }
        }
        return null;
    }

    /**
     * adds a new entity (only used on server)
     * @param modelIdentifier
     * @param location
     * @param rotation
     * @return
     *
    public long addNewEntity(String modelIdentifier, Vector3f location, Quaternion rotation) {
        newId++;
        addEntity(newId, modelIdentifier, location, rotation);
        return newId;
    }

     */
    public void addEntity(BBEntity entity){
        if(this.getEntity(entity.getObjectName()) != null){
            
        }
        entities.put(entity.getObjectName(), entity);
    }
  
    /**
     * add an entity (vehicle, immobile house etc), always related to a spatial
     * with specific userdata like hp, maxhp etc. (sends message if server)
     * @param id
     * @param modelIdentifier
     * @param location
     * @param rotation
     */
    public void addEntity(String name, String modelIdentifier, Vector3f location, Quaternion rotation) {

        if(getEntity(name) != null){
            Logger.getLogger(this.getClass().getName()).log(Level.WARNING, "try adding existing entity : {0}", name);
            return;
        }
        
        //Create the main Character as an entity      
        BBEntity wlrdEnt = new BBEntity(name);
        //Create first of all the translation component attached to the scene
        BBNodeComponent pnode = wlrdEnt.addComponent(BBNodeComponent.CompType.NODE);
        pnode.setLocalTranslation(location);
        pnode.setLocalRotation(rotation);
        wlrdEnt.attachToNode(worldRoot);
        //Load the mesh file associated to this entity for visual
        wlrdEnt.loadModel(modelIdentifier);
        
        entities.put(name, wlrdEnt);
        Logger.getLogger(this.getClass().getName()).log(Level.INFO, "Adding entity: {0}", name);
    }

    /**
     * removes the entity with the specified id, exits player if inside
     * (sends message if server)
     * @param id
     */
    public void removeEntity(String id) {
        Logger.getLogger(this.getClass().getName()).log(Level.INFO, "Removing entity: {0}", id);

        BBEntity ent = entities.remove(id);
        if (ent == null) {
            Logger.getLogger(this.getClass().getName()).log(Level.WARNING, "try removing entity thats not there: {0}", id);
            return;
        }
        //removeTransientControls(spat);
        //removeAIControls(spat);

        //spat.removeFromParent();
        BBPhysicsManager.getInstance().removePhysic(ent.getComponent(BBNodeComponent.class));
    }

    /**
     * disables an entity so that it is not displayed
     * @param id
     */
    public void disableEntity(String id) {
        Logger.getLogger(this.getClass().getName()).log(Level.INFO, "Disabling entity: {0}", id);

        BBEntity spat = getEntity(id);
        //spat.removeFromParent();
        //space.removeAll(spat);
    }

    /**
     * reenables an entity after it has been disabled
     * @param id
     * @param location
     * @param rotation
     */
    public void enableEntity(String id, Vector3f location, Quaternion rotation) {
        Logger.getLogger(this.getClass().getName()).log(Level.INFO, "Enabling entity: {0}", id);

        BBEntity spat = getEntity(id);
        //setEntityTranslation(spat, location, rotation);
        //worldRoot.attachChild(spat);
        //space.addAll(spat);
    }

    /**
     * sets the translation of an entity based on its type
     * @param entityModel
     * @param location
     * @param rotation
     */
    private void setEntityTranslation(Spatial entityModel, Vector3f location, Quaternion rotation) {
        if (entityModel.getControl(RigidBodyControl.class) != null) {
            entityModel.getControl(RigidBodyControl.class).setPhysicsLocation(location);
            entityModel.getControl(RigidBodyControl.class).setPhysicsRotation(rotation.toRotationMatrix());
        } else if (entityModel.getControl(CharacterControl.class) != null) {
            entityModel.getControl(CharacterControl.class).setPhysicsLocation(location);
            entityModel.getControl(CharacterControl.class).setViewDirection(rotation.mult(Vector3f.UNIT_Z).multLocal(1, 0, 1).normalizeLocal());
        } else if (entityModel.getControl(VehicleControl.class) != null) {
            entityModel.getControl(VehicleControl.class).setPhysicsLocation(location);
            entityModel.getControl(VehicleControl.class).setPhysicsRotation(rotation.toRotationMatrix());
        } else {
            entityModel.setLocalTranslation(location);
            entityModel.setLocalRotation(rotation);
        }
    }
    
    /**
     * removes all movement controls (ManualControl / AutonomousControl) from
     * spatial
     * @param spat
     */
    private void removeTransientControls(Spatial spat) {

        AutonomousControl autoControl = spat.getControl(AutonomousControl.class);
        if (autoControl != null) {
            spat.removeControl(autoControl);
        }
    }


    
    /**
     * makes the specified entity ready to be controlled by an AIControl
     * by adding an AutonomousControl based on entity type.
     */
    private void makeAutoControl(String entityId) {
        BBEntity spat = getEntity(entityId);
        if (spat.getComponent(BBNodeComponent.class).getControl(CharacterControl.class) != null) {
            Logger.getLogger(this.getClass().getName()).log(Level.INFO, "Make autonomous character control for entity {0} ", entityId);
            //spat.getComponent(BBNodeComponent.class).addControl(new AutonomousCharacterControl(entityId));

        }
    }


    /**
     * adds the command queue and triggers for user controlled ai entities
     */
    private void addAIControls(long playerId, String entityId) {
        //TODO: use stored controls for playerId
        BBEntity spat = getEntity(entityId);
        //spat.addControl(new CommandControl(this, playerId, entityId));

        //SphereTrigger trigger = new SphereTrigger(this);
        //spat.addControl(trigger);
    }

    /**
     * removes the command queue and triggers for user controlled ai entities
     */
    private void removeAIControls(Spatial spat) {
        CommandControl aiControl = spat.getControl(CommandControl.class);
        if (aiControl != null) {
            spat.removeControl(aiControl);
        }
        TriggerControl triggerControl = spat.getControl(TriggerControl.class);
        while (triggerControl != null) {
            spat.removeControl(triggerControl);
            triggerControl = spat.getControl(TriggerControl.class);
        }
    }

    
    /**
     * get the NavMesh of the currently loaded level
     * @return
     */
    public NavMesh getNavMesh() {
        return navMesh;
    }

    /**
     * get the world root node (not necessarily the application rootNode!)
     * @return
     */
    public Node getWorldRoot() {
        return worldRoot;
    }

 

    /**
     * creates the nav mesh for the loaded level
     */
    public void createNavMesh(Node node) {

        Mesh mesh = new Mesh();

        //version a: from mesh
        GeometryBatchFactory.mergeGeometries(findGeometries(node, new LinkedList<Geometry>()), mesh);
        Mesh optiMesh = generator.optimize(mesh);
        
        navMesh.loadFromMesh(optiMesh);

        //TODO: navmesh only for debug
        Geometry navGeom = new Geometry("NavMesh", optiMesh);
        //navGeom.setMesh(optiMesh);
        Material green = new Material(assetManager, "Common/MatDefs/Misc/Unshaded.j3md");
        green.setColor("Color", ColorRGBA.Green);
        green.getAdditionalRenderState().setWireframe(true);
        navGeom.setMaterial(green);

        System.out.println("xxxxxx Geometry name : " + navGeom.getName());
        
        worldRoot.attachChild(navGeom);
    }

    

    public List<Geometry> findGeometries(Node node, List<Geometry> geoms) {
        
        for (Iterator<Spatial> it = node.getChildren().iterator(); it.hasNext();) {
            Spatial spatial = it.next();
            if (spatial instanceof Geometry) {
                System.out.println("ooooooo Goemetry found : "+((Geometry)spatial).getName()+" mode : "+((Geometry) spatial).getMesh().getMode());
                geoms.add((Geometry) spatial);
            } else if (spatial instanceof Node) {
                System.out.println("ooo Node found : "+spatial.getName());
                findGeometries((Node) spatial, geoms);
            }
        }
        return geoms;
    }


    /**
     * does a ray test that starts at the entity location and extends in its
     * view direction by length, stores collision location in supplied
     * storeLocation vector, if collision object is an entity, returns entity
     * @param entity
     * @param length
     * @param storeVector
     * @return
     */
    public BBEntity doRayTest(BBEntity entity, float length, Vector3f storeLocation) {
        MovementControl control = entity.getComponent(BBNodeComponent.class).getControl(MovementControl.class);
        Vector3f startLocation = control.getLocation();
        Vector3f endLocation = startLocation.add(control.getAimDirection().normalize().multLocal(length));
        List<PhysicsRayTestResult> results = BBPhysicsManager.getInstance().getPhysicsSpace().rayTest(startLocation, endLocation);
        BBEntity found = null;
        float dist = Float.MAX_VALUE;
        for (Iterator<PhysicsRayTestResult> it = results.iterator(); it.hasNext();) {
            PhysicsRayTestResult physicsRayTestResult = it.next();
            BBEntity object = getEntity(physicsRayTestResult.getCollisionObject());
            if (object == entity) {
                continue;
            }
            if (physicsRayTestResult.getHitFraction() < dist) {
                dist = physicsRayTestResult.getHitFraction();
                if (storeLocation != null) {
                    FastMath.interpolateLinear(physicsRayTestResult.getHitFraction(), startLocation, endLocation, storeLocation);
                }
                found = object;
            }
        }
        return found;
    }

    /**
     * does a ray test, stores collision location in supplied storeLocation vector, if collision
     * object is an entity, returns entity
     * @param storeLocation
     * @return
     */
    public BBEntity doRayTest(Vector3f startLocation, Vector3f endLocation, Vector3f storeLocation) {
        List<PhysicsRayTestResult> results = BBPhysicsManager.getInstance().getPhysicsSpace().rayTest(startLocation, endLocation);
        //TODO: sorting of results
        BBEntity found = null;
        float dist = Float.MAX_VALUE;
        for (Iterator<PhysicsRayTestResult> it = results.iterator(); it.hasNext();) {
            PhysicsRayTestResult physicsRayTestResult = it.next();
            BBEntity object = getEntity(physicsRayTestResult.getCollisionObject());
            if (physicsRayTestResult.getHitFraction() < dist) {
                dist = physicsRayTestResult.getHitFraction();
                if (storeLocation != null) {
                    FastMath.interpolateLinear(physicsRayTestResult.getHitFraction(), startLocation, endLocation, storeLocation);
                }
                found = object;
            }
        }
        return found;
    }
 
}
