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

import com.bigboots.BBApplication;
import com.bigboots.BBGlobals;
import com.bigboots.BBWorldManager;
import com.bigboots.components.BBComponent.CompType;
import com.bigboots.components.BBEntity;
import com.bigboots.components.BBLightComponent;
import com.bigboots.components.BBNodeComponent;
import com.bigboots.components.BBObject.ObjectTag;
import com.bigboots.core.BBSceneManager;
import com.bigboots.core.BBSettings;
import com.bigboots.input.BBInputManager;
import com.bigboots.core.BBDebugInfo;
import com.bigboots.components.camera.BBFreeCamera;
import com.bigboots.gui.BBGuiManager;
import com.jme3.asset.BlenderKey;
import com.jme3.asset.DesktopAssetManager;
import com.jme3.asset.ModelKey;
import com.jme3.asset.TextureKey;
import com.jme3.bounding.BoundingBox;
import com.jme3.collision.CollisionResult;
import com.jme3.collision.CollisionResults;
import com.jme3.font.BitmapFont;
import com.jme3.font.BitmapText;
import com.jme3.input.ChaseCamera;

import com.jme3.input.KeyInput;
import com.jme3.input.MouseInput;
import com.jme3.input.controls.AnalogListener;
import com.jme3.input.controls.MouseAxisTrigger;
import com.jme3.input.controls.MouseButtonTrigger;

import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;
import com.jme3.light.DirectionalLight;
import com.jme3.light.Light.Type;
import com.jme3.material.Material;
import com.jme3.material.RenderState.BlendMode;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.math.Ray;
import com.jme3.math.Transform;
import com.jme3.math.Vector2f;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.renderer.ViewPort;
import com.jme3.renderer.queue.RenderQueue.Bucket;
import com.jme3.renderer.queue.RenderQueue.ShadowMode;
import com.jme3.scene.Geometry;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.scene.debug.Grid;
import com.jme3.scene.debug.WireBox;
import com.jme3.scene.shape.Line;
import com.jme3.texture.Texture;
import com.jme3.util.TangentBinormalGenerator;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBSceneGrid extends BBApplication{
    //Variables
    private MyTestAction actionListener;
    private BBFreeCamera mFreeCamera;
    private Camera cam;
    private Node gridNode, sceneNode;
    protected BBSceneGizmo mSceneGizmo;
    private ChaseCamera chaseCam;
    private Node nodeCamera;
    private Quaternion rotateNodeCamera;
    private WireBox wireBox = new WireBox(1, 1, 1);
    protected  Geometry selectionBox;
    private BoundingBox selectionBound;
    
    private int mEntityID = 0;
    protected List <BBEntity> entList = new ArrayList<BBEntity>();
    protected String selectedEntity = null;
    
    public BBSceneGrid() {
        super();
    }
    
    @Override
    public void simpleInitialize(){
        
        //Load the main camera
        cam = new Camera(BBSettings.getInstance().getSettings().getWidth(), BBSettings.getInstance().getSettings().getHeight());
        cam.setFrustumPerspective(45f, (float)cam.getWidth() / cam.getHeight(), 0.001f, 1000f);

        //Set up the main viewPort
        ViewPort vp = engineSystem.getRenderManager().createMainView("CUSTOM_VIEW", cam);
        vp.setClearFlags(true, true, true);
        vp.setBackgroundColor(ColorRGBA.Gray);
        BBSceneManager.getInstance().setViewPort(vp);
        
        BBSceneManager.getInstance().createSky();
        
        //Set up keys and listener to read it
        actionListener = new MyTestAction();
        
        //load keys
        setupKeys();
        
        // Add a light Source
        BBLightComponent compLight = new BBLightComponent();
        compLight.setLightType(Type.Directional);
        compLight.getLight(DirectionalLight.class).setDirection(new Vector3f(0.5432741f, -0.58666015f, -0.6005691f).normalizeLocal());
        compLight.getLight(DirectionalLight.class).setColor(new ColorRGBA(1.0f,1.0f,1.0f,1));
        BBSceneManager.getInstance().getRootNode().addLight(compLight.getLight(DirectionalLight.class));
        
        //create grid
        createGrid();
        mSceneGizmo = new BBSceneGizmo();
        mSceneGizmo.init();
        
        //Attach node to rootNode
        BBSceneManager.getInstance().addChild(gridNode);
        BBSceneManager.getInstance().addChild(sceneNode);
        
        // Selection box
        Material mat_box = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        mat_box.setColor("Color", new ColorRGBA(0.3f, 0.3f, 0.3f, 0.5f));
        mat_box.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);
        selectionBox = new Geometry("TheMesh", wireBox);
        selectionBox.setMaterial(mat_box);
        selectionBox.setShadowMode(ShadowMode.Off);
        selectionBox.setQueueBucket(Bucket.Transparent);        

        
        
        //Set debub info on
        BBDebugInfo.getInstance().setDisplayFps(true);
        BBDebugInfo.getInstance().setDisplayStatView(true);
        
    }
    
    
    @Override
    public void simpleUpdate(){

     // Camera Helper rotation alignment   
     nodeCamera.getLocalRotation().lookAt(cam.getDirection().multLocal(1f, 0f, 1f), Vector3f.UNIT_Y);
     nodeCamera.setLocalRotation(nodeCamera.getLocalRotation());
     rotateNodeCamera = nodeCamera.getLocalRotation();
    }
    
    public void loadExternalModel(String name, String path){       
        // convert to / for windows
        if (File.separatorChar == '\\'){
            path = path.replace('\\', '/');
        }
        if(!path.endsWith("/")){
            path += "/";
        }
        
        BBSceneManager.getInstance().addFileLocator(path);
        
        // Load Model
        DesktopAssetManager dsk = (DesktopAssetManager) BBSceneManager.getInstance().getAssetManager();        
        BlenderKey bk = new BlenderKey(name);   
        bk.setLoadObjectProperties(false);
        Spatial tmpSpatial =  BBSceneManager.getInstance().getAssetManager().loadModel(bk);
        
        BBEntity entity = null;
        
        if(tmpSpatial instanceof Geometry){
            Node tmpNode = new Node(tmpSpatial.getName());
            tmpNode.attachChild(tmpSpatial);
            entity = new BBEntity(tmpSpatial.getName()+mEntityID, tmpNode);
        }else if (tmpSpatial instanceof Node){
            entity = new BBEntity(tmpSpatial.getName()+mEntityID, (Node)tmpSpatial);
        }
        
        entity.setObjectTag(ObjectTag.PLAYER);
        BBNodeComponent pnode = entity.addComponent(CompType.NODE);
        pnode.setLocalTranslation(mSceneGizmo.getMarkPosition());
        entity.loadModel("");
        setShader(entity, name); 
//        entityNode.attachChild(entity.getComponent(BBNodeComponent.class));
        TangentBinormalGenerator.generate(pnode);
        entity.attachToNode(sceneNode);
        mSceneGizmo.getTranAxis().setLocalTranslation(mSceneGizmo.getMarkPosition());
        BBWorldManager.getInstance().addEntity(entity);
        BBSceneManager.getInstance().removeFileLocator(path);
        
        entList.add(entity);
        selectedEntity = entity.getObjectName();
        
        //Clear Cache
        dsk.clearCache();         

        mEntityID++;        
    }

    
    private void setShader(BBEntity ent, String nameFile){
        
        List <Geometry> lst = ent.getAllGeometries();
        
        for (Geometry geo : lst) {

        Material matNew;
        
        if (geo.getName().indexOf("CAPSULE") == 0 || geo.getName().indexOf("BOX") == 0  
        || geo.getName().indexOf("CYLINDER") == 0 || geo.getName().indexOf("HULL") == 0 || geo.getName().indexOf("MESH") == 0
        || geo.getName().indexOf("PLANE") == 0 || geo.getName().indexOf("SPHERE") == 0 || geo.getName().indexOf("CONE") == 0 
        || geo.getName().indexOf("COMPLEX") == 0 ){  
            
        matNew = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        matNew.setColor("Color", ColorRGBA.Orange);
        matNew.getAdditionalRenderState().setWireframe(true);
        matNew.setReceivesShadows(false);

        geo.setShadowMode(ShadowMode.Off);

        } else {         
            
        matNew = new Material(BBSceneManager.getInstance().getAssetManager(), "MatDefs/LightBlow/LightBlow.j3md");
//        matNew = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Light/Lighting.j3md");
        matNew.setName(geo.getMaterial().getName());
        String str = matNew.getName();        
        
         boolean check = false;

             
            TextureKey tkk = new TextureKey("Textures/skyboxes/sky_box_01/skybox_01_low.png", check);
            tkk.setAsCube(false);
            Texture ibl = BBSceneManager.getInstance().getAssetManager().loadTexture(tkk);
            matNew.setTexture("IblMap_Simple", ibl);              
        }    
        
        geo.setMaterial(matNew); 
        
      }
        
    }
    
    
    public void loadTexture(String texParam, String name, String path, List<String> strGeometryNames){       
        // convert to / for windows
        if (File.separatorChar == '\\'){
            path = path.replace('\\', '/');
        }
        if(!path.endsWith("/")){
            path += "/";
        }
        
        BBSceneManager.getInstance().addFileLocator(path);
        
        if (selectedEntity != null && strGeometryNames.size() > 0) {
        // get selected Entity 
        BBEntity geoGet = BBWorldManager.getInstance().getEntity(selectedEntity); 

        
        // check for ogre mesh   
         boolean check;
         if (geoGet.getChildMesh(strGeometryNames.get(0)).getUserData("Model").toString().indexOf("mesh.xml") < 0 ) {
             check = false;
             }
         else {
            check = true;
         }

        // Set Diffuse Map
        Texture diffuseTex = null;
        if (texParam.equals("DiffuseMap")) {    
        TextureKey tkDif = new TextureKey(name, check);
        tkDif.setAnisotropy(4);
        if (name.indexOf(".dds") < 0) tkDif.setGenerateMips(true);
        diffuseTex = BBSceneManager.getInstance().getAssetManager().loadTexture(tkDif);
        diffuseTex.setWrap(Texture.WrapMode.Repeat);
        }
        
        // Set Normal Map
        Texture normalTex = null;
        if (texParam.equals("NormalMap")) {
        TextureKey tkNor = new TextureKey(name, check);
        tkNor.setAnisotropy(4);
        if (name.indexOf(".dds") < 0) tkNor.setGenerateMips(true);
        normalTex = BBSceneManager.getInstance().getAssetManager().loadTexture(tkNor);
        normalTex.setWrap(Texture.WrapMode.Repeat);
        }
        
        for (String geoName :  strGeometryNames) {

        if (geoName.indexOf("CAPSULE") != 0 && geoName.indexOf("BOX") != 0  
                && geoName.indexOf("CYLINDER") != 0 && geoName.indexOf("HULL") != 0 && geoName.indexOf("MESH") != 0
                && geoName.indexOf("PLANE") != 0 && geoName.indexOf("SPHERE") != 0 && geoName.indexOf("CONE") != 0 
                && geoName.indexOf("COMPLEX") != 0) {

            if (texParam.equals("DiffuseMap")) geoGet.getChildMesh(geoName).getMaterial().setTexture("DiffuseMap", diffuseTex);
            else if (texParam.equals("NormalMap")) {
                geoGet.getChildMesh(geoName).getMaterial().setTexture("NormalMap", normalTex);
                if (check == false) geoGet.getChildMesh(geoName).getMaterial().setBoolean("Nor_Inv_Y", true);
            }  
        }
       }
      }  
        BBSceneManager.getInstance().removeFileLocator(path);        
    }

    public void setShaderParam(String texParam, List<String> strGeometryNames) {
       
        if (selectedEntity != null && strGeometryNames.size() > 0) {
        // get selected Entity 
        BBEntity geoGet = BBWorldManager.getInstance().getEntity(selectedEntity);         
        
        for (String geoName :  strGeometryNames) {

        if (geoName.indexOf("CAPSULE") != 0 && geoName.indexOf("BOX") != 0  
                && geoName.indexOf("CYLINDER") != 0 && geoName.indexOf("HULL") != 0 && geoName.indexOf("MESH") != 0
                && geoName.indexOf("PLANE") != 0 && geoName.indexOf("SPHERE") != 0 && geoName.indexOf("CONE") != 0 
                && geoName.indexOf("COMPLEX") != 0) {

          // check for boolean   
           boolean check = true;
           
           if (geoGet.getChildMesh(geoName).getMaterial().getParam(texParam) != null) {
               boolean isAlreadyOn = (Boolean) geoGet.getChildMesh(geoName).getMaterial().getParam(texParam).getValue();
               if (isAlreadyOn == true) check = false;
           }
            

           
           
            if (texParam.equals("Nor_Inv_X")) geoGet.getChildMesh(geoName).getMaterial().setBoolean("Nor_Inv_X", check);
            else if (texParam.equals("Nor_Inv_Y")) geoGet.getChildMesh(geoName).getMaterial().setBoolean("Nor_Inv_Y", check);
            else if (texParam.equals("Alpha_A_Dif")) {
                geoGet.getChildMesh(geoName).getMaterial().setBoolean("Alpha_A_Dif", check);
                    geoGet.getChildMesh(geoName).setQueueBucket(Bucket.Transparent); 
            }
            else if (texParam.equals("EmissiveMap")) geoGet.getChildMesh(geoName).getMaterial().setBoolean("EmissiveMap", check);
            else if (texParam.equals("Spec_A_Nor")) { 
                geoGet.getChildMesh(geoName).getMaterial().setBoolean("Spec_A_Nor", check);
                geoGet.getChildMesh(geoName).getMaterial().setBoolean("Specular_Lighting", check);
//                if (check == true) {
//                    geoGet.getChildMesh(geoName).getMaterial().setColor("Specular", ColorRGBA.White);
//                    geoGet.getChildMesh(geoName).getMaterial().setFloat("Shininess", 3.0f);                
//                 }    
            }
            else if (texParam.equals("Spec_A_Dif")) {
                geoGet.getChildMesh(geoName).getMaterial().setBoolean("Spec_A_Dif", check);
                geoGet.getChildMesh(geoName).getMaterial().setBoolean("Specular_Lighting", check);
//                if (check == true) {
//                    geoGet.getChildMesh(geoName).getMaterial().setColor("Specular", ColorRGBA.White);
//                    geoGet.getChildMesh(geoName).getMaterial().setFloat("Shininess", 3.0f);                
//                 }    
            }
//            else if (texParam.equals("Ref_A_Nor")) geoGet.getChildMesh(geoName).getMaterial().setBoolean("Ref_A_Nor", check);
//            else if (texParam.equals("Ref_A_Dif")) geoGet.getChildMesh(geoName).getMaterial().setBoolean("Ref_A_Dif", check);
       }   
      }
     }
    }
    
        public void RemoveSelectedEntity(){ 
            
            if (selectedEntity != null) {
            BBEntity entRemove = BBWorldManager.getInstance().getEntity(selectedEntity);
            entList.remove(entRemove);
            entRemove.destroy();
            entRemove = null;
            }  
            selectedEntity = null;
        }

        public void ClearScene(){ 
            selectedEntity = null;
            
            if (entList != null) {
            for (BBEntity ent : entList) {
            BBEntity entRemove = ent;
//            entList.remove(entRemove);
            entRemove.destroy();
            entRemove = null;
            }  
          }
           entList.clear(); 
        }        
        
    private void createGrid(){
        gridNode = new Node("gridNode");
    	sceneNode = new Node("sceneNode");
        
        //Create a grid plane
        Geometry g = new Geometry("GRID", new Grid(41, 41, 0.5f) );
        Material floor_mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        floor_mat.getAdditionalRenderState().setWireframe(true);
        floor_mat.setColor("Color", new ColorRGBA(0.3f, 0.3f, 0.3f, 0.13f));
        floor_mat.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);
        g.setShadowMode(ShadowMode.Off);
        g.setQueueBucket(Bucket.Transparent);
        g.setMaterial(floor_mat);
        g.center().move(new Vector3f(0f,0f,0f));
        gridNode.attachChild(g);

        // Red line for X axis
        final Line xAxis = new Line(new Vector3f(-10f, 0f, 0f), new Vector3f(10f, 0f, 0f));
        xAxis.setLineWidth(2f);
        Geometry gxAxis = new Geometry("XAxis", xAxis);
        gxAxis.setModelBound(new BoundingBox());
        Material mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        mat.setColor("Color", new ColorRGBA(1.0f, 0.2f, 0.2f, 0.3f));
        mat.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);
        gxAxis.setQueueBucket(Bucket.Transparent);
        gxAxis.setShadowMode(ShadowMode.Off);
        gxAxis.setMaterial(mat);
        gridNode.attachChild(gxAxis);

        // Bleu line for Z axis
        final Line zAxis = new Line(new Vector3f(0f, 0f, -10f), new Vector3f(0f, 0f, 10f));
        zAxis.setLineWidth(2f);
        Geometry gzAxis = new Geometry("ZAxis", zAxis);
        gzAxis.setModelBound(new BoundingBox());
        mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        mat.setColor("Color", new ColorRGBA(0.2f, 0.2f, 1.0f, 0.3f));
        mat.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);
        gxAxis.setQueueBucket(Bucket.Transparent);        
        gzAxis.setShadowMode(ShadowMode.Off);
        gzAxis.setMaterial(mat);
        gridNode.attachChild(gzAxis);

        
        BitmapFont guiFont = BBSceneManager.getInstance().getAssetManager().loadFont("Interface/Fonts/Default.fnt");
        BitmapText ch = new BitmapText(guiFont, false);
        ch.setSize(guiFont.getCharSet().getRenderedSize());
        ch.setText("W,A,S,D,Q,Z, MiddleMouseButton, RightMouseButton, Scroll"); // crosshairs
        ch.setColor(new ColorRGBA(1f,0.8f,0.1f,0.3f));
        ch.setLocalTranslation(BBSettings.getInstance().getSettings().getWidth()*0.1f,BBSettings.getInstance().getSettings().getHeight()*0.1f,0);
        BBGuiManager.getInstance().getGuiNode().attachChild(ch);           
        
    }
    
    
    
    private void setupKeys(){
                //Set up keys and listener to read it
        actionListener = new MyTestAction();
        String[] mappings = new String[]{
            "FLYCAM_Left",
            "FLYCAM_Right",
            "FLYCAM_Up",
            "FLYCAM_Down",

            "FLYCAM_StrafeLeft",
            "FLYCAM_StrafeRight",
            "FLYCAM_Forward",
            "FLYCAM_Backward",

            "FLYCAM_ZoomIn",
            "FLYCAM_ZoomOut",
            "MOUSE_CLICK_LEFT",
            "MOUSE_CLICK_RIGHT",

            "FLYCAM_Rise",
            "FLYCAM_Lower",
            "MOUSE_MOVE_LEFT",
            "MOUSE_MOVE_RIGHT"
        };
        //mouse click
        BBInputManager.getInstance().mapKey("MOUSE_MOVE_LEFT", new MouseAxisTrigger(MouseInput.AXIS_X, true));
        BBInputManager.getInstance().mapKey("MOUSE_MOVE_RIGHT", new MouseAxisTrigger(MouseInput.AXIS_X, false));
        
        // mouse only - select, move helper
        BBInputManager.getInstance().mapKey("MOUSE_CLICK_LEFT", new MouseButtonTrigger(MouseInput.BUTTON_LEFT));
        BBInputManager.getInstance().mapKey("MOUSE_CLICK_RIGHT", new MouseButtonTrigger(MouseInput.BUTTON_RIGHT));

        // keyboard only WASD for movement and WZ for rise/lower height
        BBInputManager.getInstance().mapKey("FLYCAM_StrafeLeft", new KeyTrigger(KeyInput.KEY_A));
        BBInputManager.getInstance().mapKey("FLYCAM_StrafeRight", new KeyTrigger(KeyInput.KEY_D));
        BBInputManager.getInstance().mapKey("FLYCAM_Forward", new KeyTrigger(KeyInput.KEY_W));
        BBInputManager.getInstance().mapKey("FLYCAM_Backward", new KeyTrigger(KeyInput.KEY_S));
        BBInputManager.getInstance().mapKey("FLYCAM_Rise", new KeyTrigger(KeyInput.KEY_Q));
        BBInputManager.getInstance().mapKey("FLYCAM_Lower", new KeyTrigger(KeyInput.KEY_Z));
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_CAMERA_POS, new KeyTrigger(KeyInput.KEY_F1));
        
        BBInputManager.getInstance().getInputManager().addListener(actionListener, mappings);
        BBInputManager.getInstance().getInputManager().addListener(actionListener, BBGlobals.INPUT_MAPPING_CAMERA_POS);
        
        BBInputManager.getInstance().getInputManager().setCursorVisible(false);
    }
    
       public void selectionBoxTransform() {
           selectionBound = (BoundingBox) BBWorldManager.getInstance().getEntity(selectedEntity).getComponent(BBNodeComponent.class).getWorldBound();   
           selectionBox.setLocalTranslation(selectionBound.getCenter());
           selectionBox.setLocalRotation(BBWorldManager.getInstance().getEntity(selectedEntity).getComponent(BBNodeComponent.class).getLocalRotation());
           selectionBox.setLocalScale(selectionBound.getXExtent(), selectionBound.getYExtent(), selectionBound.getZExtent());              
//           BBSceneManager.getInstance().getRootNode().updateGeometricState();                     
       }    
       
    
    class MyTestAction implements AnalogListener, ActionListener{
        
        
        MyTestAction() {
        
            nodeCamera = new Node("Camera");
            
        // line for Camera Movement
        Material mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        mat.setColor("Color", new ColorRGBA(0.5f, 0.1f, 0.1f, 0.2f));
        mat.getAdditionalRenderState().setBlendMode(BlendMode.Alpha);
            
        final Line rotHelper = new Line(new Vector3f(-0.05f, 0f, 0f), new Vector3f(0.05f, 0f, 0f));
        rotHelper.setLineWidth(1f);
        Geometry gxAxis = new Geometry("rotHelper", rotHelper);
        gxAxis.setModelBound(new BoundingBox());
        gxAxis.setQueueBucket(Bucket.Transparent);
        gxAxis.setShadowMode(ShadowMode.Off);
        gxAxis.setMaterial(mat);
        nodeCamera.attachChild(gxAxis);            

        final Line rotHelper2 = new Line(new Vector3f(0f, -0.05f, 0f), new Vector3f(0f, 0.05f, 0f));
        rotHelper2.setLineWidth(1f);
        Geometry gxAxis2 = new Geometry("rotHelper2", rotHelper2);
        gxAxis2.setModelBound(new BoundingBox());
        gxAxis2.setQueueBucket(Bucket.Transparent);
        gxAxis2.setShadowMode(ShadowMode.Off);
        gxAxis2.setMaterial(mat);
        nodeCamera.attachChild(gxAxis2);            

        final Line rotHelper3 = new Line(new Vector3f(0f, 0f, -0.05f), new Vector3f(0f, 0f, 0.05f));
        rotHelper3.setLineWidth(1f);
        Geometry gxAxis3 = new Geometry("rotHelper3", rotHelper3);
        gxAxis3.setModelBound(new BoundingBox());
        gxAxis3.setQueueBucket(Bucket.Transparent);
        gxAxis3.setShadowMode(ShadowMode.Off);
        gxAxis3.setMaterial(mat);
        nodeCamera.attachChild(gxAxis3);                    
            
            BBSceneManager.getInstance().getRootNode().attachChild(nodeCamera);
            cameraPlayer(nodeCamera);     
        }
     

        public void onAction(String binding, boolean keyPressed, float tpf) {
           /* if (binding.equals("MOUSE_CLICK_LEFT") && mFreeCamera.isDragToRotate() && !mFreeCamera.isEnabled()){
                mFreeCamera.setDragToRotate(keyPressed);
                BBInputManager.getInstance().getInputManager().setCursorVisible(!keyPressed);
            }*/
            
            if (binding.equals(BBGlobals.INPUT_MAPPING_CAMERA_POS) && !keyPressed) {
                if (cam != null) {
                    Vector3f loc = cam.getLocation();
                    Quaternion rot = cam.getRotation();
                    System.out.println("Camera Position: ("
                            + loc.x + ", " + loc.y + ", " + loc.z + ")");
                    System.out.println("Camera Rotation: " + rot);
                    System.out.println("Camera Direction: " + cam.getDirection());
                }
            }
            
            if(binding.equals("MOUSE_CLICK_RIGHT") && keyPressed){
             CollisionResults results2 = new CollisionResults();
                Vector2f click2d2 = BBInputManager.getInstance().getInputManager().getCursorPosition();
                Vector3f click3d2 = cam.getWorldCoordinates(new Vector2f(click2d2.x, click2d2.y), 0f).clone();
                Vector3f dir2 = cam.getWorldCoordinates(new Vector2f(click2d2.x, click2d2.y), 1f).subtract(click3d2);
                // Aim the ray from the clicked spot forwards.
                Ray ray2 = new Ray(click3d2, dir2);      
                sceneNode.collideWith(ray2, results2);
                if (results2.size() > 0) {
                
                    Geometry resultGeo = results2.getClosestCollision().getGeometry();
                    
                    String strEnt = resultGeo.getUserData("entityName");
                    if (strEnt != null) {
                        BBEntity entityGet = BBWorldManager.getInstance().getEntity(strEnt);
                        selectedEntity = strEnt;
                        
                    }     
                } else selectedEntity = null; 
           if (selectedEntity != null) {
           BBSceneManager.getInstance().getRootNode().attachChild(selectionBox);                 
           }   else if (selectedEntity == null){
           BBSceneManager.getInstance().getRootNode().detachChild(selectionBox);                          
           }                      
             }            
            
            
            if(binding.equals("MOUSE_CLICK_LEFT")){
                // Reset results list.
                CollisionResults results = new CollisionResults();
                // Convert screen click to 3d position
                Vector2f click2d = BBInputManager.getInstance().getInputManager().getCursorPosition();
                Vector3f click3d = cam.getWorldCoordinates(new Vector2f(click2d.x, click2d.y), 0f).clone();
                Vector3f dir = cam.getWorldCoordinates(new Vector2f(click2d.x, click2d.y), 1f).subtractLocal(click3d);
                // Aim the ray from the clicked spot forwards.
                Ray ray = new Ray(click3d, dir);
                // Collect intersections between ray and all nodes in results list.
                gridNode.collideWith(ray, results);
                // (Print the results so we see what is going on:)
                for (int i = 0; i < results.size(); i++) {
                  // (For each “hit”, we know distance, impact point, geometry.)
                  float dist = results.getCollision(i).getDistance();
                  Vector3f pt = results.getCollision(i).getContactPoint();
                  String target = results.getCollision(i).getGeometry().getName();
                  //System.out.println("Selection #" + i + ": " + target + " at " + pt + ", " + dist + " WU away.");
                }
                // Use the results -- we rotate the selected geometry.
                if (results.size() > 0) {
                  // The closest result is the target that the player picked:
                  Geometry target = results.getClosestCollision().getGeometry();
                  //System.out.println("ooo GEOM FOUND : "+target.getName());
                  // The closest collision point is what was truly hit:
                  CollisionResult closest = results.getClosestCollision();
                  // Here comes the action:
                  if (target.getName().equals("GRID")) {
                    // Let's interact - we mark the hit with a red dot.
                    mSceneGizmo.setMarkPosition(closest.getContactPoint());
                    //System.out.println("xxxxxx FOUND : "+markPosition.toString());
                  }
                }                
                //update the mark location
               mSceneGizmo.updateMarkGizmo();
            }
        }

        public void onAnalog(String name, float value, float tpf) {


            if (name.equals("FLYCAM_Forward")){
                nodeCamera.move(rotateNodeCamera.mult(Vector3f.UNIT_Z).normalizeLocal().multLocal(0.05f));
            }else if (name.equals("FLYCAM_Backward")){
                nodeCamera.move(rotateNodeCamera.mult(Vector3f.UNIT_Z).normalizeLocal().multLocal(0.05f).negateLocal());
            }else if (name.equals("FLYCAM_StrafeLeft")){
                nodeCamera.move(rotateNodeCamera.mult(Vector3f.UNIT_X).normalizeLocal().multLocal(0.05f));
            }else if (name.equals("FLYCAM_StrafeRight")){
                nodeCamera.move(rotateNodeCamera.mult(Vector3f.UNIT_X).normalizeLocal().multLocal(0.05f).negateLocal());
            }else if (name.equals("FLYCAM_Rise")){
                nodeCamera.move(rotateNodeCamera.mult(Vector3f.UNIT_Y).normalizeLocal().multLocal(0.05f));
            }else if (name.equals("FLYCAM_Lower")){
                nodeCamera.move(rotateNodeCamera.mult(Vector3f.UNIT_Y).normalizeLocal().multLocal(0.05f).negateLocal());
            }
            
         if (name.equals("MOUSE_MOVE_RIGHT") || name.equals("MOUSE_MOVE_LEFT")) {
           if (selectedEntity != null) {             
           selectionBoxTransform();
           }
         }   
            
//            if (name.equals("MOUSE_MOVE_LEFT")) {
//
//            } // else if ...

        }
        
        

        
  public void cameraPlayer(Node playerNode) {

    // Enable a chase cam
    chaseCam = new ChaseCamera(cam, playerNode, BBInputManager.getInstance().getInputManager());

    //Uncomment this to invert the camera's vertical rotation Axis 
    chaseCam.setInvertVerticalAxis(true);

    //Uncomment this to invert the camera's horizontal rotation Axis
//    chaseCam.setInvertHorizontalAxis(true);

    //Comment this to disable smooth camera motion
//    chaseCam.setSmoothMotion(true);
//    chaseCam.setChasingSensitivity(100);
//    chaseCam.setTrailingSensitivity(500);
//    chaseCam.setDragToRotate(false);

    //Uncomment this to disable trailing of the camera 
    //WARNING, trailing only works with smooth motion enabled. It is true by default.
    chaseCam.setTrailingEnabled(false);

    //Uncomment this to look 3 world units above the target
//    chaseCam.setLookAtOffset(Vector3f.UNIT_Y.mult(3));
    chaseCam.setMinVerticalRotation(-FastMath.PI*0.45f);
    chaseCam.setMaxVerticalRotation(FastMath.PI*0.45f);
    //Uncomment this to enable rotation when the middle mouse button is pressed (like Blender)
    //WARNING : setting this trigger disable the rotation on right and left mouse button click
//    chaseCam.setToggleRotationTrigger(new MouseButtonTrigger(MouseInput.BUTTON_MIDDLE));

    //Uncomment this to set mutiple triggers to enable rotation of the cam
    //Here spade bar and middle mouse button
    chaseCam.setToggleRotationTrigger(new MouseButtonTrigger(MouseInput.BUTTON_MIDDLE));

    chaseCam.setDefaultDistance(10);
    chaseCam.setMinDistance(0.05f);
    chaseCam.setMaxDistance(500);
    
  }         
        
    }//end myClass
    
    
    
}
