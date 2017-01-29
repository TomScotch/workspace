package mygame;

import com.jme3.app.SimpleApplication;
import com.jme3.asset.plugins.HttpZipLocator;
import com.jme3.bullet.BulletAppState;
import com.jme3.bullet.collision.shapes.CapsuleCollisionShape;
import com.jme3.bullet.control.BetterCharacterControl;
import com.jme3.bullet.control.CharacterControl;
import com.jme3.bullet.control.RigidBodyControl;
import com.jme3.light.DirectionalLight;
import com.jme3.material.MaterialList;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import com.jme3.post.FilterPostProcessor;
import com.jme3.post.filters.LightScatteringFilter;
import com.jme3.renderer.RenderManager;
import com.jme3.scene.Node;
import com.jme3.scene.Spatial;
import com.jme3.scene.plugins.ogre.OgreMeshKey;
import com.jme3.shadow.DirectionalLightShadowFilter;
import com.jme3.water.WaterFilter;

public class Main extends SimpleApplication {

    private WaterFilter water;
    private Vector3f lightDir = new Vector3f(-4.9f, -1.3f, 5.9f); // same as light source
    private float initialWaterHeight = -10.0f; // choose a value for your scene
    private float time = 0.0f;
    private BulletAppState bulletAppState;

    public static void main(String[] args) {
        Main app = new Main();
        app.start();
    }

    @Override
    public void simpleInitApp() {
        bulletAppState = new BulletAppState();
        stateManager.attach(bulletAppState);

        Spatial gameLevel = assetManager.loadModel("Scenes/newScene.j3o");
        gameLevel.addControl(new RigidBodyControl(0));
        bulletAppState.getPhysicsSpace().addAll(gameLevel);
        rootNode.attachChild(gameLevel);

        Node myCharacter = (Node) assetManager.loadModel("Models/simple_girl26/simple_girl2.6.j3o");
        bulletAppState.getPhysicsSpace().addAll(myCharacter);
        rootNode.attachChild(myCharacter);

        DirectionalLight sun = new DirectionalLight();
        sun.setDirection((new Vector3f(-0.5f, -0.5f, -0.5f)).normalizeLocal());
        sun.setColor(ColorRGBA.White);
        rootNode.addLight(sun);
        
        cam.setLocation(new Vector3f(0, 4, 0));
    }

    @Override
    public void simpleUpdate(float tpf) {
        super.simpleUpdate(tpf);
        /*        time += tpf;
         * waterHeight = (float) Math.cos(((time * 0.6f) % FastMath.TWO_PI)) * 1.5f;
         * water.setWaterHeight(initialWaterHeight + waterHeight);*/
    }

    @Override
    public void simpleRender(RenderManager rm) {
        //TODO: add render code
    }
}
