
println '------ admin commands version:$Revision: 2228 $';

// Set superuser to the user name (not player name) of
// the base admin user for the server.
String superUser = "";

import com.jme3.math.*;

import mythruna.Coordinates;
import mythruna.db.*;
import mythruna.es.*;

on( [playerConnected] ) {
    type, event ->
        
    Object conn = connection;
    Object p = conn.getAttribute( "player" );

    if( !p.get("userInfo.userId").equals( superUser ) && p.get( "grant.admin" ) == null )
        return;
        
    println( "Adding admin commands to " + p.get("userInfo.userId") ); 
    
    // Add some commands normally reserved for the server console
    addShellCommand( shell, "shutdown", "Shuts down the server right now.", null ) { 
        server.shell.execute( "exit" );       
    }   

    addShellCommand( shell, "kick", "Kicks a specified connection, sending them an optional message.", null ) { 
        server.shell.execute( "kick " + it );       
    }   
    
    addShellCommand( shell, "respawn", "Moves you back to the starting location.", null ) {
        respawn( conn, console );       
    }
 
    addShellCommand( shell, "grant", "Grants a specific privilege to a player.", null ) {
    
        String[] parms = it.split( " " );
        if( it.length() == 0 || parms.length == 0 ) {
            console.echo( "Your grants:" + playerData.get( "grant" ) );
        }
        
        String to = parms[0];
        toPlayer = null;
        
        if( to.isNumber() ) {
            toConn = findConnection( to.toInteger() );
            if( toConn == null ) {
                console.echo( "Connection ID not found:" + to );
                return;
            }
            toPlayer = toConn.getAttribute( "player" );              
        } else {
            console.echo( "Operation not yet supported." );
            return;
        }
       
        if( parms.length == 2 ) {
            String grant = parms[1];
            toPlayer.set( "grant." + grant, true );
            toPlayer.save(); 
        }
        console.echo( "Grants:" + toPlayer.get( "grant" ) );
    }
 
    addShellCommand( shell, "ungrant", "Removes a specific privilege from a player.", null ) {
    
        String[] parms = it.split( " " );
        if( parms.length == 0 ) {
            console.echo( "No target specified." );
        }
        
        String to = parms[0];
        toPlayer = null;
        
        if( to.isNumber() ) {
            toConn = findConnection( to.toInteger() );
            if( toConn == null ) {
                console.echo( "Connection ID not found:" + to );
                return;
            }
            toPlayer = toConn.getAttribute( "player" );              
        } else {
            console.echo( "Operation not yet supported." );
            return;
        }

        if( parms.length < 2 ) {
            console.echo( "No grants specified." );
            return;
        }
        
        String grant = parms[1];
        toPlayer.set( "grant." + grant, null );
        console.echo( "Grants:" + toPlayer.get( "grant" ) );
        toPlayer.save(); 
    }
 
    addShellCommand( shell, "tp", "Teleports a player.", null ) {
    
        println( "Teleport:" + it );
        
        String[] parms = it.split( " " );
        
        if( parms.length == 0 || parms[0].length() == 0 ) {
            console.echo( "No parameters specified." );
            return;
        }
        
        String from = parms[0];
 
        tpPlayer = null;
        
        if( from.isNumber() ) {
            tpPlayer = findConnection( from.toInteger() );
            if( tpPlayer == null ) {
                console.echo( "Connection ID not found:" + from );
                return;
            } 
        } else {
            tpPlayer = findCharacter( from );
            if( tpPlayer == null ) {
                console.echo( "Player not found:" + from );
                return;
            } 
        }
 
        if( parms.length == 1 ) {
            pos = getLocation( conn );
            console.echo( "Teleporting player:" + tpPlayer.getAttribute("player").get( "characterInfo.name" ) 
                            + " to me at:" + pos );
            warp( tpPlayer, pos.x, pos.y, pos.z );                          
        } else if( parms[1].isNumber() ) {
            
            if( parms.length < 3 ) {
                console.echo( "Not enough numbers for a location:" + it );
                return;
            }
            
            x = parms[1].toInteger();
            y = parms[2].toInteger();
            z = 160;
 
            if( parms.length > 3 ) {
                z = parms[3].toInteger();
            }                
 
            console.echo( "Warping " + from + " to:" + x + ", " + y + ", " + z );
            warp( tpPlayer, x + 0.5, y + 0.5, z );                          
        }
        
    }
 
    addShellCommand( shell, "clearleaf", "Clears the current leaf.", null ) {
    
        pos = getLocation( conn );
        cellPos = Coordinates.worldToCell( pos );
        println( "Clear:" + cellPos + "  pos:" + pos );
        
        leaf = worldDb.getLeaf( cellPos.x, cellPos.y, cellPos.z );        
        println( "Leaf:" + leaf );
        
        // clear it all out
        leaf.clear();
        
        worldDb.resetLeaf( leaf );
    }
    
    addShellCommand( shell, "regenleaf", "Regenerates the current leaf.", null ) {
    
        pos = getLocation( conn );
        cellPos = Coordinates.worldToCell( pos );
        println( "Regen:" + cellPos + "  pos:" + pos );

        leaf = worldDb.getLeaf( cellPos.x, cellPos.y, cellPos.z );        
        println( "Leaf:" + leaf ); 
         
        def locator = new DefaultLeafFileLocator( new File("mythruna.db" ) );        
        colFactory = worldDb.getColumnFactory(); //WorldUtils.createDefaultColumnFactory(locator, worldDb.getSeed());
        
        LeafData[] leafs = colFactory.createLeafs( cellPos.x, cellPos.y );

        int z = Coordinates.worldToLeaf(cellPos.z);
        println( "Generated:" + leafs[z] );        
        
        leaf.getInfo().set( leafs[z].getInfo() ); 
        leaf.setCells( leafs[z].getCells() );
        leaf.getInfo().lit = false;
        leaf.markChanged();
        
        println( "Leaf after reset:" + leaf );
        
        worldDb.resetLeaf( leaf );
    }

    addShellCommand( shell, "regencol", "Regenerates the current stack of leaves.", null ) {
    
        pos = getLocation( conn );
        cellPos = Coordinates.worldToCell( pos );
        println( "Regen:" + cellPos + "  pos:" + pos );

        //println( "Leaf:" + leaf ); 
 
        def locator = new DefaultLeafFileLocator( new File("mythruna.db" ) );        
        colFactory = worldDb.getColumnFactory(); //WorldUtils.createDefaultColumnFactory(locator, worldDb.getSeed());
        
        LeafData[] leafs = colFactory.createLeafs( cellPos.x, cellPos.y );

        for( int z = 0; z < leafs.length; z++ ) {
        
            def leaf = worldDb.getLeaf( cellPos.x, cellPos.y, z * 32 );        
            println( "Generated:" + leafs[z] );        
        
            leaf.getInfo().set( leafs[z].getInfo() ); 
            leaf.setCells( leafs[z].getCells() );
            leaf.getInfo().lit = false;
            leaf.markChanged();
        
            println( "Leaf after reset:" + leaf );
        
            worldDb.resetLeaf( leaf );
        }
    }

    addShellCommand( shell, "relightleaf", "Relights the current leaf.", null ) {
    
        pos = getLocation( conn );
        cellPos = Coordinates.worldToCell( pos );
        println( "Regen:" + cellPos + "  pos:" + pos );

        leaf = worldDb.getLeaf( cellPos.x, cellPos.y, cellPos.z );        
        println( "Leaf:" + leaf );
        
        leaf.getInfo().lit = false;
        leaf.markChanged();
        
        println( "Leaf after reset:" + leaf );
        
        worldDb.resetLeaf( leaf );
    }
    
    addShellCommand( shell, "branch", "Manually marks a revision level in the revision history.", null ) {
        
        long rev = worldDb.getLeafDb().mark();
        
        date = new Date(rev);
        
        console.echo( "Branched at:" + rev + " " + date );
    }
    
    addShellCommand( shell, "revs", "Shows the revs for the current leaf or marked section.", null ) {
        
        pos = getLocation( conn );
        cellPos = Coordinates.worldToCell( pos );
        println( "Revs:" + cellPos + "  pos:" + pos );
    
        revs = worldDb.getLeafDb().getRevisions( cellPos.x, cellPos.y, cellPos.z );
        
        println( "revs:" + revs );
 
        console.echo( revs.size() + " revisions for leaf:" + cellPos.x + ", " + cellPos.y + ", " + cellPos.z );
        
        revsList = []
        revsList.addAll(revs);
        
        int index = 0;
        revsList.reverseEach {
            date = new Date(it);
            console.echo( (index++) + " : " + it + "  " + date );
        }   
    }
    
    addShellCommand( shell, "revert", "Reverts the current leaf or marked section to a previous version.", null ) {

        if( it.trim().length() == 0 ) {
            console.echo( "No revision index specified." );
            return;
        }
         
        if( !it.isNumber() ) {        
            console.echo( "Bad parameter:" + it );
            return;
        }
 
        Integer revIndex = it.toInteger();
        
        pos = getLocation( conn );
        cellPos = Coordinates.worldToCell( pos );
        println( "Revs:" + cellPos + "  pos:" + pos );
    
        revs = worldDb.getLeafDb().getRevisions( cellPos.x, cellPos.y, cellPos.z );
        
        println( "revs:" + revs );
 
        console.echo( revs.size() + " revisions for leaf:" + cellPos.x + ", " + cellPos.y + ", " + cellPos.z );
        
        revsList = []
        revsList.addAll(revs);
        revsList = revsList.reverse();
 
        if( revIndex > revsList.size() ) {
            console.echo( "Revision not found for index:" + revIndex );
            return;               
        }
        
        long revertTo = revsList.get(revIndex);                
        console.echo( "Reverting to:" + revertTo );
        
        LeafData old = worldDb.getLeafDb().readData( cellPos.x, cellPos.y, cellPos.z, revertTo );

        leaf = worldDb.getLeaf( cellPos.x, cellPos.y, cellPos.z );        
        println( "Leaf:" + leaf );
        
        println( "old:" + old );
            
        leaf.getInfo().set( old.getInfo() ); 
        leaf.setCells( old.getCells() );
        leaf.getInfo().lit = false;
        leaf.markChanged();
        
        println( "Leaf after reset:" + leaf );
        
        worldDb.resetLeaf( leaf );
            
    }
    
    addShellCommand( shell, "resizeprop", 
                     "Increases the max area of the property that you are standing in.", null ) {
 
        def pos = getLocation();
        def loc = Coordinates.worldToCell(pos);
         
        console.echo( "You are at:" + loc );

        def property = perms.getContainingProperty( loc ); 
        if( property == null ) {
            console.echo( "You are not in a property." );
            return;
        }
        
        property = property.getId();
        
        def claimType = property[ClaimType.class];       
        console.echo( "claim type:" + claimType );      
        
        if( it.trim().length() == 0 ) {
            return;
        }
        
        if( !it.isNumber() ) {        
            console.echo( "Bad area size:" + it );
            return;
        }
        
        Integer newSize = it.toInteger();        
        property << new ClaimType( claimType.getClaimType(), newSize, claimType.getParent() );
        
        console.echo( "Max size increased to:" + newSize );
    }
}


