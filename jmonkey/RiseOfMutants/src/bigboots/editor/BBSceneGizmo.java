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

import com.bigboots.core.BBSceneManager;
import com.jme3.bounding.BoundingBox;
import com.jme3.material.Material;
import com.jme3.material.RenderState.FaceCullMode;
import com.jme3.math.ColorRGBA;
import com.jme3.math.FastMath;
import com.jme3.math.Quaternion;
import com.jme3.math.Vector3f;
import com.jme3.scene.Geometry;
import com.jme3.scene.Mesh;
import com.jme3.scene.Node;
import com.jme3.scene.debug.Arrow;
import com.jme3.scene.shape.Quad;
import com.jme3.scene.shape.Sphere;
import com.jme3.scene.shape.Torus;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBSceneGizmo {
    private Geometry mAxisX, mAxisY, mAxisZ;
    private Geometry xCircle, yCircle, zCircle;
    private Geometry sxArrow, syArrow, szArrow;
    private Node helperNode, transAxisNode, rotationAxisNode, scaleAxisNode;
    private Geometry mark;
    private Vector3f markPosition = new Vector3f(0f,0f,0f);
    
    private boolean mIsTransForm, mIsScale, mIsRotate;
    
    public BBSceneGizmo(){
        helperNode = new Node("helperNode");
        transAxisNode = new Node("transform");
        rotationAxisNode = new Node("rotator");
        scaleAxisNode = new Node("scalor");
        
        mIsTransForm = false;
        mIsScale = false;
        mIsRotate = false;
    }
    
    public void init(){
        
        initRotatorAxis();
        initTransformAxis();
        initScalorAxis();
        initMark();

        //Attach node to rootNode
        BBSceneManager.getInstance().addChild(helperNode);

    }
    
    public Vector3f getMarkPosition(){
        return mark.getLocalTranslation();
    }
    public void setMarkPosition(Vector3f pos){
        markPosition = pos;
    }
    
    public void updateMarkGizmo(){
        //System.out.println("xxxxxx FOUND : "+markPosition.toString());
        mark.setLocalTranslation(markPosition.setY(mark.getLocalTranslation().y));
    }
    
    public Node getTranAxis(){
        return transAxisNode;
    }
    public Node getScaleAxis(){
        return scaleAxisNode;
    }
    public Node getRotateAxis(){
        return rotationAxisNode;
    }
    
    public void setTranAxisVisible(boolean val){
        if(val){
            mIsTransForm = true;
            setScaleAxisVisible(false);
            setRotateAxisVisible(false);
            helperNode.attachChild(transAxisNode);
        }else{
            mIsTransForm = false;
            transAxisNode.removeFromParent();
        }
    }
    public void setScaleAxisVisible(boolean val){
        if(val){
            mIsScale = true;
            setTranAxisVisible(false);
            setRotateAxisVisible(false);
            helperNode.attachChild(scaleAxisNode);
        }else{
            mIsScale = false;
            scaleAxisNode.removeFromParent();
        }
    }
    public void setRotateAxisVisible(boolean val){
        if(val){
            mIsRotate = true;
            setTranAxisVisible(false);
            setScaleAxisVisible(false);
            helperNode.attachChild(rotationAxisNode);
        }else{
            mIsRotate = false;
            rotationAxisNode.removeFromParent();
        }
    }
    
    private void initRotatorAxis(){    	
    	Torus torus = new Torus(16,16,0.2f,4);
        xCircle = createShape((Mesh)torus, ColorRGBA.Red);
        Quaternion quatX = new Quaternion();			
        quatX.fromAngleAxis(90*FastMath.DEG_TO_RAD,new Vector3f(0,1,0));
	xCircle.setLocalRotation(quatX);
        xCircle.setModelBound(new BoundingBox());
        xCircle.setLocalTranslation(new Vector3f(0,0,0));
        xCircle.updateModelBound();
        xCircle.updateGeometricState();
        rotationAxisNode.attachChild(xCircle);
        
        torus = new Torus(16,16,0.2f,4);
    	yCircle = createShape((Mesh)torus, ColorRGBA.Green);
        yCircle.setModelBound(new BoundingBox());
        yCircle.updateModelBound();
        yCircle.setLocalTranslation(new Vector3f(0,0,0));
        Quaternion quatY = new Quaternion();					
        quatY.fromAngleAxis(-90*FastMath.DEG_TO_RAD,new Vector3f(1,0,0));
	yCircle.setLocalRotation(quatY);
	yCircle.updateGeometricState();
        rotationAxisNode.attachChild(yCircle);
        
        torus = new Torus(16,16,0.2f,4);
    	zCircle = createShape((Mesh)torus, ColorRGBA.Blue);
        zCircle.setModelBound(new BoundingBox());
        zCircle.updateModelBound();
        zCircle.setLocalTranslation(new Vector3f(0,0,0));
        rotationAxisNode.attachChild(zCircle);
        
        //Reduce the scale size
        rotationAxisNode.scale(0.2f);
        rotationAxisNode.setLocalTranslation(2f, 0f, 0f);
    }
    
    private void initTransformAxis(){
        Arrow arrow = new Arrow(Vector3f.UNIT_X);
        arrow.setLineWidth(4); // make arrow thicker
        mAxisX = createShape(arrow, ColorRGBA.Red);
        //mAxisX.setLocalTranslation(Vector3f.UNIT_X);
        
        arrow = new Arrow(Vector3f.UNIT_Y);
        arrow.setLineWidth(4); // make arrow thicker
        mAxisY = createShape(arrow, ColorRGBA.Green);

        arrow = new Arrow(Vector3f.UNIT_Z);
        arrow.setLineWidth(4); // make arrow thicker
        mAxisZ = createShape(arrow, ColorRGBA.Blue);
    }
    
    private void initScalorAxis(){
        Arrow arrow = new Arrow(Vector3f.UNIT_X);
        arrow.setLineWidth(5f);
        sxArrow = createShape(arrow, ColorRGBA.Red);
        sxArrow.setModelBound(new BoundingBox());  
        sxArrow.updateModelBound();
        sxArrow.updateGeometricState();
        
        Quad quad = new Quad(0.5f, 0.5f);
        Geometry xQuad = createShape(quad, ColorRGBA.Pink);
        xQuad.getMaterial().getAdditionalRenderState().setWireframe(false);
        xQuad.getMaterial().getAdditionalRenderState().setFaceCullMode(FaceCullMode.Off);
        xQuad.updateModelBound();
        xQuad.updateGeometricState();
        scaleAxisNode.attachChild(xQuad);
        scaleAxisNode.attachChild(sxArrow);
        //---------------------------------------------------------------
        arrow = new Arrow(Vector3f.UNIT_Y);
        arrow.setLineWidth(5f);
        syArrow = createShape(arrow, ColorRGBA.Green);
        syArrow.setModelBound(new BoundingBox());       
        syArrow.updateModelBound();
        syArrow.updateGeometricState();					
        scaleAxisNode.attachChild(syArrow);
        //---------------------------------------------------------------
        arrow = new Arrow(Vector3f.UNIT_Z);
        arrow.setLineWidth(5f);
        szArrow = createShape(arrow, ColorRGBA.Blue);
        szArrow.setModelBound(new BoundingBox());        
        szArrow.updateModelBound();
        szArrow.updateGeometricState();
        
        quad = new Quad(0.5f, 0.5f);
        Geometry zQuad = createShape(quad, ColorRGBA.Cyan);
        zQuad.getMaterial().getAdditionalRenderState().setWireframe(false);
        zQuad.getMaterial().getAdditionalRenderState().setFaceCullMode(FaceCullMode.Off);
        Quaternion quatZ = new Quaternion();					
	quatZ.fromAngleAxis((-1f)*(90)*FastMath.DEG_TO_RAD,new Vector3f(0,1,0));
        zQuad.setLocalRotation(quatZ);
        zQuad.updateModelBound();
        zQuad.updateGeometricState();
        scaleAxisNode.attachChild(zQuad);
        scaleAxisNode.attachChild(szArrow);

        scaleAxisNode.setLocalTranslation(0f, 0f, 2f);
    }
    
    // A yellow ball that marks the last spot that was "hit" by the mouse.
    private void initMark() {
        Sphere sphere = new Sphere(30, 30, 0.05f);
        mark = new Geometry("BOOM!", sphere);
        Material mark_mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        mark_mat.setColor("Color", new ColorRGBA(1, 0.9f, 0.2f, 1));
        mark.setMaterial(mark_mat);
        mark.setLocalTranslation(markPosition);
        helperNode.attachChild(mark);
    }
    
    private Geometry createShape(Mesh shape, ColorRGBA color){
        Geometry g = new Geometry("coordinate axis", shape);
        Material mat = new Material(BBSceneManager.getInstance().getAssetManager(), "Common/MatDefs/Misc/Unshaded.j3md");
        mat.getAdditionalRenderState().setWireframe(true);
        mat.setColor("Color", color);
        g.setMaterial(mat);
        transAxisNode.attachChild(g);
        return g;
    }
    
    
}
