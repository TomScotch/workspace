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
package com.bigboots.core;

import com.jme3.asset.AssetKey;
import com.jme3.asset.AssetManager;
import com.jme3.asset.TextureKey;
import com.jme3.asset.plugins.FileLocator;
import com.jme3.renderer.ViewPort;
import com.jme3.scene.Spatial;
import com.jme3.util.SkyFactory;

import com.jme3.light.AmbientLight;
import com.jme3.light.DirectionalLight;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import com.jme3.post.Filter;
import com.jme3.post.FilterPostProcessor;

import com.jme3.scene.Node;
import com.jme3.system.JmeSystem;
import java.net.MalformedURLException;
import java.net.URL;

import com.jme3.post.filters.*;
import com.jme3.renderer.queue.RenderQueue.ShadowMode;
import com.jme3.shadow.BasicShadowRenderer;
import com.jme3.shadow.PssmShadowRenderer;
import com.jme3.shadow.PssmShadowRenderer.CompareMode;
import com.jme3.shadow.PssmShadowRenderer.FilterMode;
import com.jme3.texture.Texture;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Iterator;
/**
 * Manage our specific SceneGraph
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBSceneManager {
    private static BBSceneManager instance = new BBSceneManager();

    private BBSceneManager() {
    }
    
    public static BBSceneManager getInstance() { 
        return instance; 
    }
    
    public enum FilterType {
        NONE,
        BLOOM,
        DEPHT,
        LIGHT,
        CARTOON,
        FADE,
        FOG,
        GAMMA
    }
    
    private ViewPort viewPort;
    private Node rootNode = new Node("Root Node");
    private AssetManager assetManager;
    private FilterPostProcessor mFilterProcessor;
    private HashMap<String, Filter> mFilterMap = new HashMap<String, Filter>();
    
    private  AmbientLight al;
    private Spatial sky;
    
    public void init(){   
        //BBUpdateManager.getInstance().register(this);
        if (assetManager == null){
            initAssetManager();
        }
        rootNode.setShadowMode(ShadowMode.Off);
    }
    
    public void setViewPort(ViewPort vp){
        viewPort = vp;
        viewPort.setEnabled(true);
        viewPort.attachScene(rootNode);
    }
    
    public void createFilterProcessor(){
        if(viewPort == null){
            return;
        }
        if(mFilterProcessor != null){
            return;
        }
        mFilterProcessor = new FilterPostProcessor(assetManager);
        viewPort.addProcessor(mFilterProcessor);
       
    }
    
    public void addFileLocator(String locator){
        assetManager.registerLocator(locator, FileLocator.class);
    }
    
    public void removeFileLocator(String locator){
        assetManager.unregisterLocator(locator, FileLocator.class);
    }
    
    public InputStream locateFile(String filepath){
        return assetManager.locateAsset(new AssetKey(filepath)).openStream();
    }
    
    public Node loadSpatial(String name){
        Node model = (Node) assetManager.loadModel(name);
        return model;
    }
    // TODO : Change it next time
    public void createSky() {
        //sky = SkyFactory.createSky(assetManager, "Textures/sky/skybox1.jpeg", true);
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
        
        sky = SkyFactory.createSky(assetManager, sky_west, sky_east, sky_north, sky_south, sky_top, sky_bottom, normalScale);
        
        this.addChild(sky);
    }
    
    public void createFilter(String name, FilterType type){
        
        switch (type) {
            case BLOOM :
                BloomFilter bf = new BloomFilter(BloomFilter.GlowMode.Objects);
                mFilterProcessor.addFilter(bf);                
                mFilterMap.put(name, bf);
            break;               
            case FOG :
                FogFilter fog=new FogFilter();
                mFilterProcessor.addFilter(fog);
                mFilterMap.put(name, fog);
            break;
            case DEPHT :
                DepthOfFieldFilter dofFilter = new DepthOfFieldFilter();
                mFilterProcessor.addFilter(dofFilter);
                mFilterMap.put(name, dofFilter);
            break;
            case LIGHT :
                LightScatteringFilter lgtFilter = new LightScatteringFilter();
                mFilterProcessor.addFilter(lgtFilter);
                mFilterMap.put(name, lgtFilter);
            break;
            case CARTOON :
                CartoonEdgeFilter toon=new CartoonEdgeFilter();
                mFilterProcessor.addFilter(toon);
                mFilterMap.put(name, toon);
            break;
            default: 
                throw new RuntimeException("None or unsupported Filter Type");
        }
    }
    
    public Filter getFilterbyName(String name) {
        return mFilterMap.get(name);
    }
    
    /**
     * finds the entity name of a given Filter if there is one
     * @param filter
     * @return String name
     */
    public String getFilterName(Filter filter) {
        for (Iterator<Entry<String, Filter>> it = mFilterMap.entrySet().iterator(); it.hasNext();) {
            Entry<String, Filter> entry = it.next();
            if (entry.getValue() == filter) {
                return entry.getKey();
            }
        }
        return "NONE";
    }
    
    public void addChild(Spatial sp){
        rootNode.attachChild(sp);
    }

    public void removeChild(Spatial sp){
        rootNode.detachChild(sp);
    }    
    
    public void addChild(Node node){
        rootNode.attachChild(node);
    }
    
    public void update(float tpf) {
        rootNode.updateLogicalState(tpf);
        rootNode.updateGeometricState();        
    }
    
    //TODO : To be changed
    public void setupBasicLight(){
        // We add light so we see the scene
        DirectionalLight dl = new DirectionalLight();
        dl.setDirection(new Vector3f(0.5f, -0.5f, -0.6f).normalizeLocal());
        dl.setColor(new ColorRGBA(1.0f,1.0f,1.0f,1));
        rootNode.addLight(dl); 
    }  
    
    public void setUpBasicShadow(){
/*        BasicShadowRenderer bsr = new BasicShadowRenderer(assetManager, 256);
        bsr.setDirection(new Vector3f(0.5f, -0.5f, -0.6f).normalizeLocal()); // light direction
        viewPort.addProcessor(bsr);
*/        
        PssmShadowRenderer pssmRenderer = new PssmShadowRenderer(assetManager, 1024, 3);
        pssmRenderer.setDirection(new Vector3f(0.5f, -0.5f, -0.6f).normalizeLocal());
        //pssmRenderer.setLambda(0.55f);
        pssmRenderer.setShadowIntensity(0.4f);
        //pssmRenderer.setCompareMode(CompareMode.Software);
        //pssmRenderer.setFilterMode(FilterMode.Bilinear);
        //pssmRenderer.setShadowZextend();
        //pssmRenderer.displayDebug();
        viewPort.addProcessor(pssmRenderer);
         
    }
    
    
    private void initAssetManager(){
        if (BBSettings.getInstance().getSettings() != null){
            String assetCfg = BBSettings.getInstance().getSettings().getString("AssetConfigURL");
            if (assetCfg != null){
                URL url = null;
                try {
                    url = new URL(assetCfg);
                } catch (MalformedURLException ex) {
                }
                if (url == null) {
                    url = BBEngineSystem.class.getClassLoader().getResource(assetCfg);
                    if (url == null) {
                        //logger.log(Level.SEVERE, "Unable to access AssetConfigURL in asset config:{0}", assetCfg);
                        return;
                    }
                }
                assetManager = JmeSystem.newAssetManager(url);
            }
        }
        if (assetManager == null){
            assetManager = JmeSystem.newAssetManager(
                    Thread.currentThread().getContextClassLoader()
                    .getResource("com/jme3/asset/Desktop.cfg"));
        }
    }
    
    public void destroy(){
        sky.getLocalLightList().clear();
        sky.getWorldLightList().clear();
        sky.removeFromParent();
        sky = null;
        
        rootNode.removeLight(al); 
        rootNode.getLocalLightList().clear();
        rootNode.getWorldLightList().clear();              
        rootNode.detachAllChildren();
        rootNode.removeFromParent();
    
        al = null;
        rootNode = null;
        
        viewPort.clearScenes();
        viewPort = null;
    }
               
    /**
     * Retrieves rootNode
     * @return rootNode Node object
     *
     */
    public Node getRootNode() {
        return rootNode;
    }
    
    public ViewPort getViewPort() {
        return viewPort;
    }
    /**
     * @return The {@link AssetManager asset manager} for this application.
     */
    public AssetManager getAssetManager(){
        return assetManager;
    }
    
}
