package mygame;

import com.jme3.app.SimpleApplication;
import com.jme3.light.DirectionalLight;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Vector3f;
import com.jme3.post.FilterPostProcessor;
import com.jme3.post.filters.LightScatteringFilter;
import com.jme3.renderer.RenderManager;
import com.jme3.scene.Spatial;
import com.jme3.shadow.DirectionalLightShadowFilter;
import com.jme3.water.WaterFilter;

public class Main extends SimpleApplication {

    private WaterFilter water;
    private Vector3f lightDir = new Vector3f(-4.9f, -1.3f, 5.9f); // same as light source
    private float initialWaterHeight = -10.0f; // choose a value for your scene
    private float time = 0.0f;
    private float waterHeight = 0.0f;

    public static void main(String[] args) {
        Main app = new Main();
        app.start();
    }

    @Override
    public void simpleInitApp() {
        Spatial city = assetManager.loadModel("Models/serpertine city/serpentine city.j3o");
        rootNode.attachChild(city);

        DirectionalLight sun = new DirectionalLight();
        sun.setDirection((new Vector3f(-0.5f, -0.5f, -0.5f)).normalizeLocal());
        sun.setColor(ColorRGBA.White);
        rootNode.addLight(sun);

        FilterPostProcessor fpp = new FilterPostProcessor(assetManager);
        DirectionalLightShadowFilter dlsf = new DirectionalLightShadowFilter(assetManager, 1024, 2);
        dlsf.setLight(sun);
        fpp.addFilter(dlsf);

        fpp = new FilterPostProcessor(assetManager);
        water = new WaterFilter(rootNode, lightDir);
        water.setWaterHeight(initialWaterHeight);
        fpp.addFilter(water);

        LightScatteringFilter sunlight = new LightScatteringFilter(new Vector3f(.5f, .5f, .5f).multLocal(-3000));
        fpp.addFilter(sunlight);
        viewPort.addProcessor(fpp);

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
