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

import com.bigboots.BBCanvasApplication;
import com.bigboots.BBWorldManager;
import com.bigboots.core.BBSceneManager;
import com.jme3.math.FastMath;
import com.jme3.scene.Geometry;
import java.awt.Dimension;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.swing.AbstractButton;
import javax.swing.DefaultListModel;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JList;
import javax.swing.JMenu;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSeparator;
import javax.swing.event.ListSelectionEvent;

import javax.swing.filechooser.FileFilter;

import javax.swing.JToolBar;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.border.Border;
import javax.swing.event.ListSelectionListener;



/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public class BBModelViewer extends BBCanvasApplication implements ActionListener, ListSelectionListener{
    private final JFileChooser mFileCm;
    private FileFilter modFilter = new BBModelFilter();
    private FileFilter texFilter = new BBTextureFilter();
    private JList listEntity, listGeo;
    private DefaultListModel modelEntity, modelGeo;
    private List<String> strLst = new ArrayList<String>();
    
    public BBModelViewer(){
        //Create a file chooser for Models
        mFileCm = new JFileChooser();
        //mFileC.setFileSelectionMode(JFileChooser.FILES_ONLY);
        mFileCm.addChoosableFileFilter(modFilter);
        mFileCm.addChoosableFileFilter(texFilter);
        mFileCm.setAcceptAllFileFilterUsed(false);
        mFileCm.setPreferredSize(new Dimension(800, 600));
     
    }

    public static void main(String[] args){  
        BBModelViewer myEditor = new BBModelViewer();
        myEditor.start();
        
    }

    @Override
    public void createCustomMenu() {
        JMenu menuAsset = new JMenu("Asset");
        menuBar.add(menuAsset);

//        final JMenuItem clearScene = new JMenuItem("Clear Scene");
//        menuAsset.add(clearScene);
//        clearScene.addActionListener(new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//
//            }
//        });        
        
        // ToolBar
        JToolBar toolBar = new JToolBar("Viewer Options");
        toolBar.setFloatable(false);
        toolBar.setRollover(true);
        addButtons(toolBar);
        mMainFrame.add(toolBar, BorderLayout.PAGE_START);
        
        // entityList
        buttons();
        entityList();
        geometryList();
        

    }

    private void buttons() {
        
        JButton loadModelButton = new JButton("Load Model"); 
        loadModelButton.setSize(200, 20);
        loadModelButton.setPreferredSize(new Dimension(190, 20));
        loadModelButton.setVerticalTextPosition(AbstractButton.CENTER);
        loadModelButton.setHorizontalTextPosition(AbstractButton.LEADING); 
        loadModelButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                loadModelFromFile();
                
            }
        });         
        optionPanel.add(loadModelButton);          
        
        JButton loadDiffuseButton = new JButton("Load Diffuse Texture"); 
        loadDiffuseButton.setSize(200, 20);
        loadDiffuseButton.setPreferredSize(new Dimension(190, 20));
        loadDiffuseButton.setVerticalTextPosition(AbstractButton.CENTER);
        loadDiffuseButton.setHorizontalTextPosition(AbstractButton.LEADING); 
        loadDiffuseButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
              if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) loadDiffuseTexture();
                
                
            }
        });         
        optionPanel.add(loadDiffuseButton);          

        JButton loadNormalButton = new JButton("Load Normal Texture"); 
        loadNormalButton.setSize(200, 20);
        loadNormalButton.setPreferredSize(new Dimension(190, 20));
        loadNormalButton.setVerticalTextPosition(AbstractButton.CENTER);
        loadNormalButton.setHorizontalTextPosition(AbstractButton.LEADING); 
        loadNormalButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
              if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) loadNormalTexture();
            }
        });         
        optionPanel.add(loadNormalButton);         
        
        optionPanel.add(new JToolBar.Separator());         
        
        
        JButton RemoveSelectedModel = new JButton("Remove Selected Model"); 
        RemoveSelectedModel.setSize(200, 20);
        RemoveSelectedModel.setPreferredSize(new Dimension(190, 20));
        RemoveSelectedModel.setVerticalTextPosition(AbstractButton.CENTER);
        RemoveSelectedModel.setHorizontalTextPosition(AbstractButton.LEADING); 
        RemoveSelectedModel.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

        
                if (((BBSceneGrid)app).selectedEntity != null || listEntity.getSelectedValue() != null){
                modelGeo.clear();
                listGeo.repaint();
                
                modelEntity.removeElement(((BBSceneGrid)app).selectedEntity);
                listEntity.repaint();         
                
                ((BBSceneGrid)app).RemoveSelectedEntity();                 
              }
            }
        });         
        optionPanel.add(RemoveSelectedModel);         
        
        JButton clearScene = new JButton("Clear Scene"); 
        clearScene.setSize(200, 20);
        clearScene.setPreferredSize(new Dimension(190, 20));
        clearScene.setVerticalTextPosition(AbstractButton.CENTER);
        clearScene.setHorizontalTextPosition(AbstractButton.LEADING); 
        clearScene.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                ((BBSceneGrid)app).ClearScene();
                modelEntity.clear();
                listEntity.repaint();
                modelGeo.clear();
                listGeo.repaint();
            }
        });         
        optionPanel.add(clearScene);     
        
        
        optionPanel.add(new JToolBar.Separator());         
        
        
        
        JButton Nor_Inv_X = new JButton("Normal InvertX"); 
        Nor_Inv_X.setSize(200, 20);
        Nor_Inv_X.setPreferredSize(new Dimension(190, 20));
        Nor_Inv_X.setVerticalTextPosition(AbstractButton.CENTER);
        Nor_Inv_X.setHorizontalTextPosition(AbstractButton.LEADING); 
        Nor_Inv_X.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
                    ((BBSceneGrid)app).setShaderParam("Nor_Inv_X", strLst);
            }
        });         
        optionPanel.add(Nor_Inv_X); 
        
        JButton Nor_Inv_Y = new JButton("Normal InvertY"); 
        Nor_Inv_Y.setSize(200, 20);
        Nor_Inv_Y.setPreferredSize(new Dimension(190, 20));
        Nor_Inv_Y.setVerticalTextPosition(AbstractButton.CENTER);
        Nor_Inv_Y.setHorizontalTextPosition(AbstractButton.LEADING); 
        Nor_Inv_Y.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
                    ((BBSceneGrid)app).setShaderParam("Nor_Inv_Y", strLst);
            }
        });         
        optionPanel.add(Nor_Inv_Y); 
        
        JButton Alpha_A_Dif = new JButton("Alpha Diffuse"); 
        Alpha_A_Dif.setSize(200, 20);
        Alpha_A_Dif.setPreferredSize(new Dimension(190, 20));
        Alpha_A_Dif.setVerticalTextPosition(AbstractButton.CENTER);
        Alpha_A_Dif.setHorizontalTextPosition(AbstractButton.LEADING); 
        Alpha_A_Dif.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
                    ((BBSceneGrid)app).setShaderParam("Alpha_A_Dif", strLst);
            }
        });         
        optionPanel.add(Alpha_A_Dif); 
        
        JButton EmissiveMap = new JButton("Emissive Alpha Diffuse"); 
        EmissiveMap.setSize(200, 20);
        EmissiveMap.setPreferredSize(new Dimension(190, 20));
        EmissiveMap.setVerticalTextPosition(AbstractButton.CENTER);
        EmissiveMap.setHorizontalTextPosition(AbstractButton.LEADING); 
        EmissiveMap.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
                    ((BBSceneGrid)app).setShaderParam("EmissiveMap", strLst);
            }
        });         
        optionPanel.add(EmissiveMap); 
        
        JButton Spec_A_Nor = new JButton("Specular Normal"); 
        Spec_A_Nor.setSize(200, 20);
        Spec_A_Nor.setPreferredSize(new Dimension(190, 20));
        Spec_A_Nor.setVerticalTextPosition(AbstractButton.CENTER);
        Spec_A_Nor.setHorizontalTextPosition(AbstractButton.LEADING); 
        Spec_A_Nor.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
                    ((BBSceneGrid)app).setShaderParam("Spec_A_Nor", strLst);
            }
        });         
        optionPanel.add(Spec_A_Nor); 
        
        JButton Spec_A_Dif = new JButton("Specular Diffuse"); 
        Spec_A_Dif.setSize(200, 20);
        Spec_A_Dif.setPreferredSize(new Dimension(190, 20));
        Spec_A_Dif.setVerticalTextPosition(AbstractButton.CENTER);
        Spec_A_Dif.setHorizontalTextPosition(AbstractButton.LEADING); 
        Spec_A_Dif.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
                    ((BBSceneGrid)app).setShaderParam("Spec_A_Dif", strLst);
            }
        });         
        optionPanel.add(Spec_A_Dif); 
        
//        JButton Ref_A_Nor = new JButton("Reflection Normal"); 
//        Ref_A_Nor.setSize(200, 20);
//        Ref_A_Nor.setPreferredSize(new Dimension(190, 20));
//        Ref_A_Nor.setVerticalTextPosition(AbstractButton.CENTER);
//        Ref_A_Nor.setHorizontalTextPosition(AbstractButton.LEADING); 
//        Ref_A_Nor.addActionListener(new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
//                    ((BBSceneGrid)app).setShaderParam("Ref_A_Nor", strLst);
//            }
//        });         
//        optionPanel.add(Ref_A_Nor); 
//        
//        JButton Ref_A_Dif = new JButton("Reflection Normal"); 
//        Ref_A_Dif.setSize(200, 20);
//        Ref_A_Dif.setPreferredSize(new Dimension(190, 20));
//        Ref_A_Dif.setVerticalTextPosition(AbstractButton.CENTER);
//        Ref_A_Dif.setHorizontalTextPosition(AbstractButton.LEADING); 
//        Ref_A_Dif.addActionListener(new ActionListener() {
//            public void actionPerformed(ActionEvent e) {
//                if (((BBSceneGrid)app).selectedEntity != null && strLst.size() > 0) 
//                    ((BBSceneGrid)app).setShaderParam("Ref_A_Dif", strLst);
//            }
//        });         
//        optionPanel.add(Ref_A_Dif); 
                
    }
    
    private void entityList() {

        // Create a list that allows adds and removes
        modelEntity = new DefaultListModel();
                
		// Create a new listbox control
		listEntity = new JList(modelEntity);
                
		// Set the frame characteristics
//		listbox.setTitle( "Simple ListBox Application" );
                listEntity.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
                listEntity.setLayoutOrientation(JList.VERTICAL);
		listEntity.setSize( 180, 200 );
                listEntity.setPreferredSize(new Dimension(180, 200));
		listEntity.setBackground( new Color(245,245,245));
                listEntity.addListSelectionListener (this);
                
                JScrollPane listScroller = new JScrollPane(listEntity);
                listScroller.setSize(listEntity.getSize());   
                listScroller.setPreferredSize(listEntity.getPreferredSize());
                optionPanel.add(listScroller, BorderLayout.CENTER);                
        
    }
    

    private void geometryList() {

        
        // Create a list that allows adds and removes
        modelGeo = new DefaultListModel();
                
// Get the index of all the selected items
//int[] selectedIx = listGeo.getSelectedIndices();

		// Create a new listbox control
		listGeo = new JList( modelGeo );
                
		// Set the frame characteristics
//		listGeo.setTitle( "Simple ListBox Application" );
                listGeo.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);
                listGeo.setLayoutOrientation(JList.VERTICAL);
		listGeo.setSize( 180, 200 );
                listGeo.setPreferredSize(new Dimension(180, 200));
		listGeo.setBackground( new Color(245,245,245));
                listGeo.addListSelectionListener (this);
                
//                listGeo.setSelectedIndices(selectedIx);
//                Object[] selected = listGeo.getSelectedValues();

                // Get number of items in the list
//                int size = list.getModel().getSize();

        // Get all item objects
//        for (int i=0; i<size; i++) {
//        Object item = list.getModel().getElementAt(i);
//        }                
                
                JScrollPane listScroller2 = new JScrollPane(listGeo);
                listScroller2.setSize(listGeo.getSize());
                listScroller2.setPreferredSize(listGeo.getPreferredSize());
                optionPanel.add(listScroller2, BorderLayout.CENTER);                
                
    }
    
    
    private void loadModelFromFile(){
        mFileCm.setFileFilter(modFilter);
        int returnVal = mFileCm.showOpenDialog(null);
        
        if (returnVal == JFileChooser.APPROVE_OPTION) {
            File file = mFileCm.getSelectedFile();
            try{
                mLogArea.append("Loading file : " + file.getCanonicalPath() +"\n");
                ((BBSceneGrid)app).loadExternalModel(file.getName(), file.getParent());
                
                //Load Entity list

                modelEntity.addElement(((BBSceneGrid)app).selectedEntity);
                listEntity.repaint();
                // Load Geometries list
                modelGeo.clear();
                
                for (int i=0; i<BBWorldManager.getInstance().getEntity(((BBSceneGrid)app).selectedEntity).getAllGeometries().toArray().length; i++) {
                    Geometry geo = BBWorldManager.getInstance().getEntity(((BBSceneGrid)app).selectedEntity).getAllGeometries().get(i);
                    geo.setUserData("Model", file.getName());
                    modelGeo.add(i, geo.getName());
                    }                
                
                listGeo.repaint();
                strLst.clear();
                
            }catch (IOException ex){}
            
        }
        
        mFileCm.setSelectedFile(null);
    }

    private void loadDiffuseTexture(){
        mFileCm.setFileFilter(texFilter);
        int returnVal = mFileCm.showOpenDialog(null);
        
        if (returnVal == JFileChooser.APPROVE_OPTION) {
            File file = mFileCm.getSelectedFile();
//            mFileCt.setCurrentDirectory(file);
            try{
                mLogArea.append("Loading file : " + file.getCanonicalPath() +"\n");

                if (strLst.size() > 0 && ((BBSceneGrid)app).selectedEntity != null) {

                ((BBSceneGrid)app).loadTexture("DiffuseMap", file.getName(), file.getParent(), strLst);
                }
            }catch (IOException ex){}
        }
        
        mFileCm.setSelectedFile(null);
    }  
    
    private void loadNormalTexture(){
        mFileCm.setFileFilter(texFilter);
        int returnVal = mFileCm.showOpenDialog(null);
        
        if (returnVal == JFileChooser.APPROVE_OPTION) {
            File file = mFileCm.getSelectedFile();
//            mFileCt.setCurrentDirectory(file);
            try{
                mLogArea.append("Loading file : " + file.getCanonicalPath() +"\n");
                

                if (strLst.size() > 0 && ((BBSceneGrid)app).selectedEntity != null) {
                
                ((BBSceneGrid)app).loadTexture("NormalMap", file.getName(), file.getParent(), strLst);
                
                }
            }catch (IOException ex){}
        }
        
        mFileCm.setSelectedFile(null);
    } 
    
    
    static final private String PREVIOUS = "previous";
    static final private String UP = "up";
    static final private String NEXT = "next";
    static final private String SOMETHING_ELSE = "other";
    static final private String TEXT_ENTERED = "text";
    protected void addButtons(JToolBar toolBar) {
        JButton button = null;
 
        //first button
        button = makeNavigationButton("Up24", UP,
                                      "Selection tool",
                                      "SELECT");
        toolBar.add(button);
 
        //second button
        button = makeNavigationButton("Back24", PREVIOUS,
                                      "Rotation tool",
                                      "ROTATE");
        toolBar.add(button);
 
        //third button
        button = makeNavigationButton("Forward24", NEXT,
                                      "Scale",
                                      "SCALE");
        toolBar.add(button);
 
        //separator
        toolBar.addSeparator();
 
    }
    
    
    protected JButton makeNavigationButton(String imageName,
                                           String actionCommand,
                                           String toolTipText,
                                           String altText) {
        //Look for the image.
        String imgLocation = "images/"
                             + imageName
                             + ".gif";
        URL imageURL = BBModelViewer.class.getResource(imgLocation);

        //Create and initialize the button.
        JButton button = new JButton();
        button.setActionCommand(actionCommand);
        button.setToolTipText(toolTipText);
        button.addActionListener(this);
 
        if (imageURL != null) {                      //image found
            button.setIcon(new ImageIcon(imageURL, altText));
        } else {                                     //no image found
            button.setText(altText);
            System.err.println("Resource not found: "
                               + imgLocation);
        }
 
        return button;
    }

    public void actionPerformed(ActionEvent e) {
        String cmd = e.getActionCommand();
        String description = null;
 
        // Handle each button.
        if (PREVIOUS.equals(cmd)) { //first button clicked
            ((BBSceneGrid)app).mSceneGizmo.setRotateAxisVisible(true);
        } else if (UP.equals(cmd)) { // second button clicked
            ((BBSceneGrid)app).mSceneGizmo.setTranAxisVisible(true);
        } else if (NEXT.equals(cmd)) { // third button clicked
            ((BBSceneGrid)app).mSceneGizmo.setScaleAxisVisible(true);
        }
    }

    public void valueChanged(ListSelectionEvent lse) {

      JList lst = (JList) lse.getSource();

      // If Entity is changed in the Entitylist
      if (lst != null && lst.equals(listEntity) && lst.getSelectedIndex() != -1 
          && BBWorldManager.getInstance().getEntity(((BBSceneGrid)app).selectedEntity) != null) {
         ((BBSceneGrid)app).selectedEntity = (String) listEntity.getModel().getElementAt(lst.getSelectedIndex());

          // Load Geometries list
          modelGeo.clear();
          if (((BBSceneGrid)app).selectedEntity != null) {
          for (int i=0; i<BBWorldManager.getInstance().getEntity(((BBSceneGrid)app).selectedEntity).getAllGeometries().toArray().length; i++) {
          modelGeo.add(i, BBWorldManager.getInstance().getEntity(((BBSceneGrid)app).selectedEntity).getAllGeometries().get(i).getName());
                } 
          }
      }     

      // List of selected geometries
       if (lst.getSelectedIndex() != -1 && lst.equals(listGeo) && ((BBSceneGrid)app).selectedEntity != null) {
           
         strLst.clear();                
         for(int i : listGeo.getSelectedIndices()){
          strLst.add(modelGeo.get(i).toString());
         }      
       } else if (lst.getSelectedIndex() == -1 && lst.equals(listGeo)) strLst.clear();
       
       
    }
    
}    
