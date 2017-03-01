package com.bigboots;

//import com.bigboots.states.BBInGameState;
import com.bigboots.gui.BBGuiManager;
import com.bigboots.states.BBMainMenuState;
import com.bigboots.states.BBStateManager;


public class BBMain extends BBApplication{

    @Override
    public void simpleInitialize(){
        //Set up interface gui XML
        BBGuiManager.getInstance().addXmlGui("Interface/mainmenu.xml");
        BBGuiManager.getInstance().addXmlGui("Interface/ingame.xml");
        BBGuiManager.getInstance().getNifty().gotoScreen("null");
        
        //Launch the main menu screen/
        BBMainMenuState window = new BBMainMenuState();
        //BBInGameState window = new BBInGameState();
        BBStateManager.getInstance().attach(window);
    }
    
    @Override
    public void simpleUpdate(){
        
    }    
    
    public static void main(String[] args) {
               
        BBMain app = new BBMain();
        app.run();
    }
}