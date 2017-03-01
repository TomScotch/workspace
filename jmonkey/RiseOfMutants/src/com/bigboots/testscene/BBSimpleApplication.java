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
package com.bigboots.testscene;

import com.bigboots.BBApplication;
import com.bigboots.BBGlobals;
import com.bigboots.components.BBLightComponent;
import com.bigboots.core.BBSceneManager;
import com.bigboots.core.BBSettings;
import com.bigboots.input.BBInputManager;
import com.bigboots.core.BBDebugInfo;
import com.bigboots.components.camera.BBFreeCamera;

import com.jme3.input.KeyInput;
import com.jme3.input.MouseInput;
import com.jme3.input.controls.AnalogListener;
import com.jme3.input.controls.MouseAxisTrigger;
import com.jme3.input.controls.MouseButtonTrigger;

import com.jme3.input.controls.ActionListener;
import com.jme3.input.controls.KeyTrigger;
import com.jme3.light.DirectionalLight;
import com.jme3.light.Light.Type;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import com.jme3.renderer.Camera;
import com.jme3.renderer.ViewPort;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBSimpleApplication extends BBApplication{
  
    //Variables
    private MyTestAction actionListener;
    protected BBFreeCamera mFreeCamera;
    protected Camera cam;
    
    public BBSimpleApplication() {
        super();
    }
    
    @Override
    public void simpleInitialize(){

        //Load the main camera
        cam = new Camera(BBSettings.getInstance().getSettings().getWidth(), BBSettings.getInstance().getSettings().getHeight());
        cam.setFrustumPerspective(45f, (float)cam.getWidth() / cam.getHeight(), 1f, 1000f);
        cam.setLocation(new Vector3f(0f, 0f, 29f));
        cam.lookAt(new Vector3f(0f, 0f, 0f), Vector3f.UNIT_Y);
        
        //Set up the main viewPort
        ViewPort vp = engineSystem.getRenderManager().createMainView("CUSTOM_VIEW", cam);
        vp.setClearFlags(true, true, true);
        vp.setBackgroundColor(ColorRGBA.Gray);
        BBSceneManager.getInstance().setViewPort(vp);
        
        mFreeCamera = new BBFreeCamera("FREE_CAM", cam);
        mFreeCamera.setMoveSpeed(30);
        
        //Set up basic light and sky coming with the standard scene manager
//        BBSceneManager.getInstance().setupBasicLight();
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
        
        //Set debub info on
        BBDebugInfo.getInstance().setDisplayFps(true);
        BBDebugInfo.getInstance().setDisplayStatView(true);
        
    }
    
    @Override
    public void simpleUpdate(){
        if(actionListener.mQuit == true){
            engineSystem.stop(false);
        }
    }
    
    public BBFreeCamera getFreeCamera(){
        return mFreeCamera;
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
            "FLYCAM_RotateDrag",

            "FLYCAM_Rise",
            "FLYCAM_Lower"
        };

        // both mouse and button - rotation of cam
        BBInputManager.getInstance().mapKey("FLYCAM_Left", new MouseAxisTrigger(MouseInput.AXIS_X, true),
                                               new KeyTrigger(KeyInput.KEY_LEFT));

        BBInputManager.getInstance().mapKey("FLYCAM_Right", new MouseAxisTrigger(MouseInput.AXIS_X, false),
                                                new KeyTrigger(KeyInput.KEY_RIGHT));

        BBInputManager.getInstance().mapKey("FLYCAM_Up", new MouseAxisTrigger(MouseInput.AXIS_Y, false),
                                             new KeyTrigger(KeyInput.KEY_UP));

        BBInputManager.getInstance().mapKey("FLYCAM_Down", new MouseAxisTrigger(MouseInput.AXIS_Y, true),
                                               new KeyTrigger(KeyInput.KEY_DOWN));

        // mouse only - zoom in/out with wheel, and rotate drag
        BBInputManager.getInstance().mapKey("FLYCAM_ZoomIn", new MouseAxisTrigger(MouseInput.AXIS_WHEEL, false));
        BBInputManager.getInstance().mapKey("FLYCAM_ZoomOut", new MouseAxisTrigger(MouseInput.AXIS_WHEEL, true));
        BBInputManager.getInstance().mapKey("FLYCAM_RotateDrag", new MouseButtonTrigger(MouseInput.BUTTON_LEFT));

        // keyboard only WASD for movement and WZ for rise/lower height
        BBInputManager.getInstance().mapKey("FLYCAM_StrafeLeft", new KeyTrigger(KeyInput.KEY_A));
        BBInputManager.getInstance().mapKey("FLYCAM_StrafeRight", new KeyTrigger(KeyInput.KEY_D));
        BBInputManager.getInstance().mapKey("FLYCAM_Forward", new KeyTrigger(KeyInput.KEY_W));
        BBInputManager.getInstance().mapKey("FLYCAM_Backward", new KeyTrigger(KeyInput.KEY_S));
        BBInputManager.getInstance().mapKey("FLYCAM_Rise", new KeyTrigger(KeyInput.KEY_Q));
        BBInputManager.getInstance().mapKey("FLYCAM_Lower", new KeyTrigger(KeyInput.KEY_Z));
        
        BBInputManager.getInstance().mapKey(BBGlobals.INPUT_MAPPING_EXIT, new KeyTrigger(KeyInput.KEY_ESCAPE));        
        BBInputManager.getInstance().getInputManager().addListener(actionListener, BBGlobals.INPUT_MAPPING_EXIT);
        BBInputManager.getInstance().getInputManager().addListener(actionListener, mappings);
        
        BBInputManager.getInstance().setMouseCenter();
        BBInputManager.getInstance().getInputManager().setCursorVisible(false);
    }
    
    class MyTestAction implements AnalogListener, ActionListener{
    
        public boolean mQuit = false; 

        public void onAction(String binding, boolean keyPressed, float tpf) {
            if (binding.equals(BBGlobals.INPUT_MAPPING_EXIT) && !keyPressed) {
                mQuit = true; 
            }
            
            if (binding.equals("FLYCAM_RotateDrag") && mFreeCamera.isDragToRotate() && !mFreeCamera.isEnabled()){
                mFreeCamera.setDragToRotate(keyPressed);
                BBInputManager.getInstance().getInputManager().setCursorVisible(!keyPressed);
            }
        }

        public void onAnalog(String name, float value, float tpf) {
            if (!mFreeCamera.isEnabled())
                return;

            if (name.equals("FLYCAM_Left")){
                mFreeCamera.rotateCamera(value, mFreeCamera.getUpVector());
            }else if (name.equals("FLYCAM_Right")){
                mFreeCamera.rotateCamera(-value, mFreeCamera.getUpVector());
            }else if (name.equals("FLYCAM_Up")){
                mFreeCamera.rotateCamera(-value, mFreeCamera.getEngineCamera().getLeft());
            }else if (name.equals("FLYCAM_Down")){
                mFreeCamera.rotateCamera(value, mFreeCamera.getEngineCamera().getLeft());
            }else if (name.equals("FLYCAM_Forward")){
                mFreeCamera.moveCamera(value, false);
            }else if (name.equals("FLYCAM_Backward")){
                mFreeCamera.moveCamera(-value, false);
            }else if (name.equals("FLYCAM_StrafeLeft")){
                mFreeCamera.moveCamera(value, true);
            }else if (name.equals("FLYCAM_StrafeRight")){
                mFreeCamera.moveCamera(-value, true);
            }else if (name.equals("FLYCAM_Rise")){
                mFreeCamera.riseCamera(value);
            }else if (name.equals("FLYCAM_Lower")){
                mFreeCamera.riseCamera(-value);
            }else if (name.equals("FLYCAM_ZoomIn")){
                mFreeCamera.zoomCamera(value);
            }else if (name.equals("FLYCAM_ZoomOut")){
                mFreeCamera.zoomCamera(-value);
            }
        }
    }  

}