package com.bigboots.testscene;


import com.jme3.app.SimpleApplication;
import com.jme3.asset.DesktopAssetManager;
import com.jme3.asset.ModelKey;
import com.jme3.asset.TextureKey;
import com.jme3.light.DirectionalLight;
import com.jme3.material.Material;
import com.jme3.math.*;
import com.jme3.scene.*;
import com.jme3.scene.Node;
import com.jme3.scene.shape.*;
import com.jme3.texture.Texture;
import com.jme3.util.SkyFactory;
import com.jme3.util.TangentBinormalGenerator;


public class TestScene extends SimpleApplication {

    Geometry geom_a;
    Material mat_box;
    Node ndmd;
    
    // models
     Spatial obj01;
     Spatial obj02;
     Spatial obj03;
     Spatial ledder;
    
     // collision shapes
     Geometry obj01_l;
     Geometry obj02_l;
     Geometry obj03_l;
     Geometry ledder_l;
     
      
    public static void main(String[] args) {
        TestScene app = new TestScene();
        app.start();
    }

    
    
     public void Models () {
        
         //Create an empty node for models 
         ndmd = new Node("Models");
         
         
        // Material
        Material mat = assetManager.loadMaterial("Scenes/TestScene/TestSceneMaterial.j3m"); 
        
        // set Image Based Lighting
        Texture ibl = assetManager.loadTexture("Textures/skyboxes/sky_box_01/skybox_01_low.png");
        mat.setTexture("IblMap_Simple", ibl); 
        
        
        Mesh sph_test = new Sphere(20, 20, 5);
        Geometry geo_test = new Geometry("geo_test", sph_test);
        geo_test.setMaterial(mat);
        TangentBinormalGenerator.generate(sph_test);
        geo_test.setLocalTranslation(0, 0, 10);
        geo_test.rotate(1.6f, 0, 0);
        rootNode.attachChild(geo_test);
        
        
        // Models
        obj01 = assetManager.loadModel("Scenes/TestScene/obj01.obj"); 
        obj01.setName("obj01");
        TangentBinormalGenerator.generate(obj01);
        obj01.setMaterial(mat);
        ndmd.attachChild(obj01);
        
        obj02 = assetManager.loadModel("Scenes/TestScene/obj02.obj"); 
        obj02.setName("obj02");
        TangentBinormalGenerator.generate(obj02);
        obj02.setMaterial(mat);
        ndmd.attachChild(obj02);

        obj03 = assetManager.loadModel("Scenes/TestScene/obj03.obj"); 
        obj03.setName("obj03");
        TangentBinormalGenerator.generate(obj03);    
        obj03.setMaterial(mat);
        ndmd.attachChild(obj03);

        ledder = assetManager.loadModel("Scenes/TestScene/ledder.obj"); 
        ledder.setName("ledder");
        TangentBinormalGenerator.generate(ledder);    
        ledder.setMaterial(mat);
        ndmd.attachChild(ledder);

        
        //Collision Shapes
        obj01_l =  (Geometry) assetManager.loadModel("Scenes/TestScene/obj01_l.obj"); 
        obj02_l =  (Geometry) assetManager.loadModel("Scenes/TestScene/obj02_l.obj"); 
        obj03_l =  (Geometry) assetManager.loadModel("Scenes/TestScene/obj03_l.obj"); 
        ledder_l =  (Geometry) assetManager.loadModel("Scenes/TestScene/ledder_l.obj"); 

          // Collision Shapes to be used
//        CompoundCollisionShape myComplexShape = CollisionShapeFactory.createMeshShape((Node) myComplexGeometry );

        
        
        
        // Spawn Points of Mutants
        Box box_a = new Box(Vector3f.ZERO, 0.3f, 0.3f, 0.3f);
        geom_a = new Geometry("spawn", box_a);
        geom_a.updateModelBound();
        
        mat_box = new Material(assetManager, "Common/MatDefs/Misc/Unshaded.j3md");
        mat_box.setColor("m_Color", ColorRGBA.Blue);
        geom_a.setMaterial(mat_box);
        ndmd.attachChild(geom_a);
        
        
        
        }
     
     
    
    @Override
    public void simpleInitApp() {
        
        Models();
             
        // set Skybox. 
        TextureKey key_west = new TextureKey("Textures/skyboxes/sky_box_01/skybox_01_west.png", true);
        key_west.setGenerateMips(true);
        Texture sky_west = assetManager.loadTexture(key_west);
        TextureKey key_east = new TextureKey("Textures/skyboxes/sky_box_01/skybox_01_east.png", true);
        key_east.setGenerateMips(true);
        Texture sky_east = assetManager.loadTexture(key_east);        
        TextureKey key_north = new TextureKey("Textures/skyboxes/sky_box_01/skybox_01_north.png", true);
        key_north.setGenerateMips(true);
        Texture sky_north = assetManager.loadTexture(key_north);        
        TextureKey key_south = new TextureKey("Textures/skyboxes/sky_box_01/skybox_01_south.png", true);
        key_south.setGenerateMips(true);
        Texture sky_south = assetManager.loadTexture(key_south);        
        TextureKey key_top = new TextureKey("Textures/skyboxes/sky_box_01/skybox_01_top.png", true);
        key_top.setGenerateMips(true);
        Texture sky_top = assetManager.loadTexture(key_top);        
        TextureKey key_bottom = new TextureKey("Textures/skyboxes/sky_box_01/skybox_01_bottom.png", true);
        key_bottom.setGenerateMips(true);
        Texture sky_bottom = assetManager.loadTexture(key_bottom);        
        
        Vector3f normalScale = new Vector3f(1, 1, 1);
        
        Spatial sky = SkyFactory.createSky(assetManager, sky_west, sky_east, sky_north, sky_south, sky_top, sky_bottom, normalScale);
        rootNode.attachChild(sky);
        
        
        // Load a blender file. 
        DesktopAssetManager dsk = (DesktopAssetManager) assetManager;        
        ModelKey bk = new ModelKey("Scenes/TestScene/test_scene_01_1.blend");
      //  bk.setFixUpAxis(false);
        Node nd =  (Node) dsk.loadModel(bk); 
        
        //Create empty Scene Node
        Node ndscene = new Node("Scene");
        
        
        // Attach boxes with names and transformations of the blend file to a Scene
         for (int j=0; j<ndmd.getChildren().size();j++){
            String strmd = ndmd.getChild(j).getName();
                
            for (int i=0; i<nd.getChildren().size(); i++) {
                      
               String strndscene = nd.getChild(i).getName();
             if (strmd.length() < strndscene.length())  strndscene = strndscene.substring(0, strmd.length());
               
         
            if (strndscene.equals(strmd) == true){
                Spatial ndGet =  ndmd.getChild(j).clone(false);
                ndGet.setName(nd.getChild(i).getName());
                ndGet.setLocalTransform(nd.getChild(i).getWorldTransform());
                ndscene.attachChild(ndGet);   
                
         }    
         }
         }
           
        rootNode.attachChild(ndscene);


//Search for geometries        
 SceneGraphVisitor sgv = new SceneGraphVisitor() {

            public void visit(Spatial spatial) {
                System.out.println(spatial);

                if (spatial instanceof Geometry) {
            
                Geometry geom = (Geometry) spatial;
                System.out.println(geom.getMesh());
                
        }
            }
        };
 
  rootNode.depthFirstTraversal(sgv);    
 // rootNode.breadthFirstTraversal(sgv);    
         
        
        // Clear Cache
        nd.detachAllChildren();
        nd.removeFromParent();
        dsk.clearCache();
  
    
        
        
        // Add a light Source
        DirectionalLight dl = new DirectionalLight();
        dl.setDirection(new Vector3f(-0.8f, -0.6f, -0.08f).normalizeLocal());
        dl.setColor(new ColorRGBA(1.0f,1.0f,1.0f,1));
        rootNode.addLight(dl);
        
        flyCam.setMoveSpeed(30);
        viewPort.setBackgroundColor(ColorRGBA.Gray);

}


    }




