
println '------ dirty words filter version:$Revision: 2223 $';

// Replaces the word key with the value only if the word
// key appears at the beginning of a word.  Trailing word
// parts are kept so that if "foo":"bar" then "fooing" -> "baring"
// and so on.
def dirty_prefixes = [
        "shit" : "poo",
        "gay" : "happy",
        "fag" : "stick",
        "faggot" : "stick",
        "pussy" : "cat",
        "twat" : "cat",
        "cunt" : "cat",
        "clit" : "button",
        "dick" : "tool",
        "penis" : "tool",
        "tits" : "mellons"
    ];

// Replaces the word key with the value only if the word
// appears completely as written and not as part of another
// word.
// So, "foo":"bar" means that "fooing" stays "fooing" and
// "mofoo" stays "mofoo".
def dirty_words = [
        "ass" : "tail",
        "asshole" : "rear-entry",
        "dumbass" : "donkey-head"
    ];

// Replaces the string key with the value anywhere
// it appears in the message, regardless of if it is
// in the middle of a word or not.  
//
// For example, if the mapping is:
//     ass:butt
// then "classic" becomes "clbuttic"
//
// It is also case sensitive unless additional regex bits are
// added to the key.  For example: "(?i)ass" would match Ass, ass, ASS, etc.  
def dirty_stems = [
        "(?i)fucking" : "stinking",
        "(?i)fucker" : "stinker",
        "(?i)fuck" : "golly"
    ];


import java.util.regex.Pattern;

def patterns = new LinkedHashMap();
dirty_prefixes.entrySet().each {
    patterns.put( Pattern.compile( /(?i)(?<!\w)${it.key}(\w*)/ ), it.value + "\$1" );
}
dirty_words.entrySet().each {
    patterns.put( Pattern.compile( /(?i)(?<!\w)${it.key}(?!\w)/ ), it.value );
}
dirty_stems.entrySet().each {
    patterns.put( Pattern.compile( it.key ), it.value );
}


on( [playerChatted] ) {
    type, event ->

    // This is not an efficient way but will work for a few
    // dozen dirty words, ok.    
    patterns.entrySet().each {
        event.message = it.key.matcher(event.message).replaceAll( it.value );
    }
}
