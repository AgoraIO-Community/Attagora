// THIS IS THE MESSAGING CLASS, TO SEND MESSAGES AND ATTACHMENTS
var commHandler = function( )
{
    // THE AGORA APPID & CERTIFICATE FOR ATTACHMENTS
    var APPID_ATTACH = "dd3789b534f14f479bdafafdeab56a0f";
    var APPCERTIFICATE_ATTACH = "bb22d04f37f34a288a6de172a104eedf";

    // THE USER CURRENTLY LOGGED IN
    var user = null;
    var uid = null;
    
    // THE AGORA SIGNALING OBJECTS
    var signal_attach = Signal( APPID_ATTACH );
    
    // THE ATTACHMENT SESSION
    var session_attach = null;

    // USER LOGIN FUNCTION
    // USER NEEDS TO LOG IN TO USE THE MESSAGING FUNCTIONS
    // user: USERNAME
    this.login = function( username )
    {
        // STORE USERNAME BEING LOGGED IN (BASE64)
        user = username;
        
        // LOG USER IN WITH TOKEN, CREATE MESSAGING OBJECT
        session_attach = signal_attach.login( user, getOneDayToken( APPID_ATTACH, APPCERTIFICATE_ATTACH, user ) );
        
        // LOGIN SUCCESS CALLBACK
        session_attach.onLoginSuccess = function( uid )
        {
            console.log( "USER: " + user + " | LOGGED IN!" );
            console.log( "ATTACH UID: " + uid );
        };
        
        // LOGIN FAILURE CALLBACK
        session_attach.onLoginFailed = function( ecode )
        {
            console.log( "ATTACH LOGIN ERROR: " + ecode );
        };
        
        // attachData: IS A STRING THAT IS UPDATED WHEN
        // AN ATTACHMENT CHUNK IS RECEIVED
        session_attach.attachData = null;
        
        // CALLBACK FOR RECEIVING ATTACHMENT CHUNKS
        session_attach.onMessageInstantReceive = function( from, uid, msg )
        {
            if( checkIfAttachment( msg ) )
            {
                // IF IT IS AN ATTACHMENT CHUNK, ADD TO THE CURRENT DATA,
                // OR CONVERT FROM BASE64 AND DOWNLOAD
                this.attachData = receiveInChunks( this.attachData, msg );
            }
        };
    };
    
    // FUNCTION TO RETURN THE SELECTED FILE
    // THIS FUNCTION CAN BE CHANGED AS LONG AS
    // return: File OBJECT
    function uploadAttachment( )
    {
        return document.getElementById('attachment').files[ 0 ];
    };
    
    // FUNCTION TO SEND ATTACHMENTS ( ONCE LOGGED IN )
    // to: USER RECEIVING THE MESSAGE
    this.sendAttachment = function( to )
    {
        // THE FILE IS RETRIEVED
        var attachment = uploadAttachment( );
        
        // IF USER IS LOGGED IN AND A FILE IS RETRIEVED
        if( session_attach && attachment )
        {
            // DECLARE FILE READER
            var reader = new FileReader( );
            
            // OBTAIN FILENAME
            var fileName = attachment.name;
            
            // READ FILE AS A STRING OF BYTES
            reader.readAsBinaryString( attachment );
            
            // PASS THE MESSAGING OBJECT TO SEND THE FILE
            reader.session_attach = session_attach;
            
            // ONCE THE FILE READER AS READ THE ENTIRE FILE
            reader.onload = function( )
            {
                // CONVERT THE FILE TO BASE64, SEND IT IN CHUNKS
                sendInChunks( this.session_attach, to, fileName, reader.result );
            };
        }
    };
    
    // LOGOUT FUNCTION
    this.logout = function( )
    {
        // IF USER IS LOGGED IN
        if( session_attach )
        {
            console.log( "USER: " + user + " | LOGGED OUT!" );
            
            // RELEASE THE MESSAGING OBJECT, AND LOGOUT USER
            session_attach.logout( );
            session_attach = null;
            user = null;
        }
    };
};
