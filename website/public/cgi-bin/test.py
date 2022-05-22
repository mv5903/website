#!/usr/bin/python3


    

print ("Content-type:text/html\r\n\r\n")
print ('<html>')
print ('<head>')
print ('<title>Hello Word - First CGI Program</title>')
print ('</head>')
print ('<body>')

try:
    from .__init__ import *
    
except Exception as e:
    print('<p>' + e + '</p>')

print ('<h2>Hello Word! This is my first CGI program</h2>')
print ('</body>')
print ('</html>')