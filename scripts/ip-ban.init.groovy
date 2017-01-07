
import java.util.regex.*;

println '------ IP ban scripts version:$Revision: 2224 $';

// Set superuser to the user name (not player name) of
// the base admin user for the server.
String superUser = "";


class IpList {
    static File ipFile = new File( "scripts/ip-bans.txt" );
    static Set ips = new HashSet();
 
    public static void load() {
        if( ipFile.exists() ) {
            ipFile.eachLine {
                String ip = it.trim();
                if( ip.length() > 0 ) {
                    println "Banned ip:" + ip
                    ips.add(ip);
                }
            }
        }              
    }
    
    public static void save() {
        //println "Need to write list:" + ips;
        //println "To file:" + ipFile;
        println "Storing IP ban list to:" + ipFile
        ipFile.write ips.join( "\n" ); 
    }
 
    public static boolean contains( String ip ) {
        return ips.contains(ip);
    }
    
    public static boolean add( String ip ) {
        if( ips.add(ip) ) {
            ipFile.append "\n"
            ipFile.append ip
            return true;
        }
        return false;
    }
    
    public static boolean remove( String ip ) {
        if( ips.remove(ip) ) {
            save();
            return true;
        }
        return false;
    }
}    

IpList.load();

addressParse = Pattern.compile( "/(.*):.*" );

// The event to actually ban based on IP address
on( [newConnection] ) {
    type, event ->

    // address:/127.0.0.1:1057
    matcher = addressParse.matcher(event.context.address);
    if( matcher.matches() ) {
        address = matcher.group(1);
        
        println "New connection from IP address:" + address;
        if( IpList.contains(address) ) {  
            println "*** Kicking banned address:" + address;
            event.context.close( "Connection refused." );
        }
    }         
}

// Add some commands to admin for banning and unbanning IP
// addresses

on( [playerConnected] ) {
    type, event ->
        
    Object conn = connection;
    Object p = conn.getAttribute( "player" );
    //Set ips = bannedIps;

    if( !p.get("userInfo.userId").equals( superUser ) 
        && p.get( "grant.moderator" ) == null 
        && p.get( "grant.admin" ) == null ) {
        return;
    }        
        
    println( "Adding IP ban commands to " + p.get("userInfo.userId") ); 
    
    addShellCommand( shell, "ban", "Bans the specified IP address.", null ) {
        println "conn:" + conn;
        
        ip = it.trim();
        
        if( IpList.add( ip ) ) {        
            console.echo( "Banned IP:" + ip );
        } else {
            console.echo( "IP is already banned:" + ip );
        } 
    }

    addShellCommand( shell, "unban", "Removes a bans for the specified IP address.", null ) {
        println "conn:" + conn;
        
        ip = it.trim();
        
        if( IpList.remove( ip ) ) {        
            console.echo( "Removed ban on IP:" + ip );
        } else {
            console.echo( "IP is not banned:" + ip );
        } 
    }
    
}
