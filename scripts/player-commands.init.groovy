
println '------ player commands version:$Revision: 2223 $';

import com.jme3.math.*;

import mythruna.Coordinates;
import mythruna.db.*;

on( [playerConnected] ) {
    type, event ->
        
    Object p = conn.getAttribute( "player" );

    println( "Adding player commands to " + p.get("userInfo.userId") ); 
    
    addShellCommand( shell, "escape", "Teleports you above your current location at 160 meters.", null ) {
        pos = getLocation( connection );
        console.echo( "Warping to:" + pos.x + ", " + pos.y + ", " + 160 );
        warp( connection, (float)(pos.x + 0.5f), (float)(pos.y + 0.5f), 160.0f );                          
    }
 
}


