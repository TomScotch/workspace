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
package com.bigboots;

import com.bigboots.core.BBEngineSystem;
import com.bigboots.testscene.BBSimpleApplication;
import com.jme3.system.AppSettings;
import com.jme3.system.JmeCanvasContext;
import com.jme3.util.JmeFormatter;
import java.awt.BorderLayout;
import java.awt.Canvas;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.WindowStateListener;
import java.util.concurrent.Callable;
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Logger;
import javax.swing.AbstractButton;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import javax.swing.JScrollPane;
import javax.swing.JSplitPane;
import javax.swing.JTextArea;
import javax.swing.SwingUtilities;

/**
 *
 * @author @author Ulrich Nzuzi <ulrichnz@code.google.com>
 */
public abstract class BBCanvasApplication {
    protected BBEngineSystem engineSystem;
    protected static JFrame mMainFrame;
    protected static JMenu menuFile;
    protected static JMenu menuEdit;
    protected static JMenuBar menuBar;
    protected static JTextArea mLogArea;
            
    private static JmeCanvasContext context;
    private static Canvas mCanvas;
    protected static BBApplication app;
    protected static JPanel canvasPanel;
    protected static JPanel optionPanel;
    private static final String appClass = "bigboots.editor.BBSceneGrid";

    /*
     * Main game loop.
     */
    public void start(){
        JmeFormatter formatter = new JmeFormatter();

        Handler consoleHandler = new ConsoleHandler();
        consoleHandler.setFormatter(formatter);

        Logger.getLogger("").removeHandler(Logger.getLogger("").getHandlers()[0]);
        Logger.getLogger("").addHandler(consoleHandler);
        
        createCanvas(appClass);
        
        try {
            Thread.sleep(500);
        } catch (InterruptedException ex) {
        }
        
        SwingUtilities.invokeLater(new Runnable(){
            public void run(){
                JPopupMenu.setDefaultLightWeightPopupEnabled(false);

                createFrame();
                
                //currentPanel.add(canvas, BorderLayout.CENTER);
                mMainFrame.pack();
                startApp();
                mMainFrame.setLocationRelativeTo(null);
                mMainFrame.setVisible(true);
            }
        });
        
        
    }
    
    private static void createCanvas(String appClass){
        AppSettings settings = new AppSettings(true);

        // Get the default toolkit
	Toolkit toolkit = Toolkit.getDefaultToolkit();

	// Get the current screen size
	Dimension scrnsize = toolkit.getScreenSize();
        
        settings.setWidth(scrnsize.width - 300);
        settings.setHeight(scrnsize.height - 300);
        

        try{
            Class<? extends BBApplication> clazz = (Class<? extends BBApplication>) Class.forName(appClass);
            app = clazz.newInstance();
        }catch (ClassNotFoundException ex){
            System.out.println("CLASS NOT FOUND");
            ex.printStackTrace();
        }catch (InstantiationException ex){
            System.out.println("INSTANTIATION EXCEPTION");
            ex.printStackTrace();
        }catch (IllegalAccessException ex){
            System.out.println("ILLEGAL ACCESS EXCEPTION");
            ex.printStackTrace();
        }
        
        app.getEngine().setPauseOnLostFocus(false);
        //app.setNewSettings(settings);
        app.initCanvas();
        //app.getEngine().startCanvas();

        context = (JmeCanvasContext) app.getEngine().getContext();
        mCanvas = context.getCanvas();
        mCanvas.setSize(settings.getWidth(), settings.getHeight());
    }
    
    private void createFrame(){
        mMainFrame = new JFrame("BBModel Viewer");
        mMainFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        mMainFrame.setFont(new Font("Arial", Font.PLAIN, 12));
        mMainFrame.setResizable(false);
        mMainFrame.addWindowStateListener(new WindowStateListener(){
            @Override
            public void windowStateChanged(WindowEvent e) {
                app.reshape(e.getWindow().getWidth(), e.getWindow().getHeight());
            }
            
        });
        
        mMainFrame.addWindowListener(new WindowAdapter(){
            @Override
            public void windowClosed(WindowEvent e) {
                app.getEngine().stop();
            }
        });

        createTabs();
        createMenu();
    }
    
    public static void startApp(){
        app.getEngine().startCanvas();
        app.getEngine().enqueue(new Callable<Void>(){
            public Void call(){
                if (app instanceof BBSimpleApplication){
                    BBSimpleApplication simpleApp = (BBSimpleApplication) app;
                    //simpleApp.getFreeCamera().setDragToRotate(true);
                }
                return null;
            }
        });
        
    }
    
    private void createTabs(){
       
        // Create the graphic panel
        canvasPanel = new JPanel();
        canvasPanel.setLayout(new BorderLayout());
        canvasPanel.add(mCanvas, BorderLayout.CENTER);
        canvasPanel.setMinimumSize(new Dimension(100,50));
        
        // Create the options and properties panel
        optionPanel = new JPanel();
        optionPanel.setLayout(new FlowLayout());

        // Set the size
        optionPanel.setMinimumSize(new Dimension(30,30));	
        optionPanel.setPreferredSize(new Dimension(200,10));

        // Create the log area
        mLogArea = new JTextArea(5,20);
        mLogArea.setMargin(new Insets(5,5,5,5));
        mLogArea.setEditable(false);
        JScrollPane logScrollPane = new JScrollPane(mLogArea);
        
        // Das SplitPanel wird in optionPanel (links) und canvasPanel (rechts) unterteilt
        JSplitPane split = new JSplitPane();
        split.setOrientation(JSplitPane.HORIZONTAL_SPLIT);
        split.setLeftComponent(canvasPanel);
        split.setRightComponent(optionPanel);
        
        JSplitPane splitLog = new JSplitPane();
        splitLog.setOrientation(JSplitPane.VERTICAL_SPLIT);
        splitLog.setBottomComponent(logScrollPane);
        splitLog.setTopComponent(split);
        splitLog.setResizeWeight(1);
                
        mMainFrame.add(splitLog, BorderLayout.CENTER);        
    }
    
    

    
    
    private void createMenu(){
        menuBar = new JMenuBar();
        mMainFrame.setJMenuBar(menuBar);

        menuFile = new JMenu("File");
        menuBar.add(menuFile);
              
        final JMenuItem itemOpen = new JMenuItem("Open");
        menuFile.add(itemOpen);
        itemOpen.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                
            }
        });
        final JMenuItem itemSave = new JMenuItem("Save");
        menuFile.add(itemSave);
        itemSave.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                
            }
        });
        
        JMenuItem itemExit = new JMenuItem("Exit");
        menuFile.add(itemExit);
        itemExit.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent ae) {
                mMainFrame.dispose();
                app.getEngine().stop();
            }
        });  
        
        menuEdit = new JMenu("Edit");
        menuBar.add(menuEdit);
        
        createCustomMenu();
        
    }
    
    
    public abstract void createCustomMenu();
    
    
}
