# Attagora
A demo arrangement for sending files through the Agora Signaling SDK for web using nothing more than Javascript.

1. Simply open "Attagora.html" for each client.
2. Follow the instruction on the webpage.

# Function

The way it is able to send files is by nothing more than a base64 converter and the signaling service, to transform all bytes into visible characters and send the data in chunks with the maximum size per message. Each chunk contains a header that functions as an identifier to detect whether the message belongs to a file or not. The header also contains information regarding the file it belongs to and what type of chunk it may be.

During reception, the program determines whether or not the chunk is the first, last or somewhere in between to either create a new data string, terminate one and produce a download url, or simply append to the running string. We take advantage of Javascript's atob() and btoa() functions to convert to and from base64 when needed. 
